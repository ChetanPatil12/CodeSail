const express = require('express')
const {generateSlug} = require('random-word-slugs')
const {ECSClient,RunTaskCommand} = require('@aws-sdk/client-ecs')
const {Server} = require('socket.io')
const Redis = require('ioredis')

const app = express()
const PORT = 9000

const subscriber = new Redis('rediss://default:AVNS_lZx6bE8YBCGp4YOMtrw@redis-73f113c-codesail.a.aivencloud.com:20454')

const io = new Server({cors:'*'})

io.on('connection', socket =>{
    socket.on('subscribe', channel =>{
        socket.join(channel)
        socket.emit('message',`Joined ${channel}`)
    })
})

io.listen(9001, ()=> console.log('Socket Server 9001'))

const ecsClient = new ECSClient({
    region:'ap-south-1',
    credentials: {
        accessKeyId: 'AKIAXYKJQCK3AV3VZOL7',
        secretAccessKey: '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'
    }
})

const config = {
    CLUSTER:'arn:aws:ecs:ap-south-1:533266961078:cluster/buildercluster',
    TASK:'arn:aws:ecs:ap-south-1:533266961078:task-definition/builder-task'

}

app.use(express.json())

app.post('/project',async (req,res)=>{
    const {gitURL,slug} = req.body
    const projectSlug = slug ? slug : generateSlug();

    //spin the container
    const command = new RunTaskCommand({
        cluster: config.CLUSTER,
        taskDefinition: config.TASK,
        launchType:'FARGATE',
        count:1,
        networkConfiguration:{
            awsvpcConfiguration:{
                assignPublicIp:'ENABLED',
                subnets:['subnet-02f75215cc65f6756','subnet-0396ddc6b816ff6da','subnet-0785080a9d0f6bb04'],
                securityGroups:['sg-0ca039bf434e6cf28']
            }
        },
        overrides:{
            containerOverrides:[{
                name:'builder-image',
                environment:[
                    {name:'GIT_REPOSITORY__URL',value:gitURL},
                    {name:'PROJECT_ID',value:projectSlug}
                ]
            }]
        }
    })

    await ecsClient.send(command); 
    return res.json({status:'queued',data:{projectSlug,url:`http://${projectSlug}.localhost:8000`}})
})

async function initRedisSubscribe(){
    console.log('Subscribed to logs....')
    subscriber.psubscribe('logs:*')
    subscriber.on('pmessage',(pattern,channel,message) =>{
        io.to(channel).emit('message',message)
    })
}

initRedisSubscribe()


app.listen(PORT, ()=> console.log(`Api server running ... ${PORT}`))