import express, { Application, Request, Response } from 'express'
import { json, urlencoded } from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'

// import userRouter from './module/user/user.router'
// import organizationRouter from './module/organization/organization.router'
// import adminRouter from './module/admin/admin.router'
// import earnRuleRouter from './module/earn-rule/earnrule.router'
// import communityRouter from './module/community/community.router'
// import shopRouter from './module/shop/shop.router'
import userRouter from './module/user/user.router'
import provinceRouter from './module/province/province.router'
import licenseRouter from './module/license_plate/licenseplate.router'
import accessRouter from './module/access_history/acess.router'
import detectionRouter from './module/detection_history/detection.router'

const PORT = 8080

const app: Application = express()

app.disable('x-powered-by')
app.use(morgan('dev'))
app.use(urlencoded({ extended: true }))
app.use(json())
app.use(cors())

// http://localhost:8080/test

//Routes
// app.use('/api/shop', shopRouter)
// app.use('/api/community', communityRouter)
// app.use('/api/earnrule', earnRuleRouter)
app.use('/api/user', userRouter)
app.use('/api/province', provinceRouter)
app.use('/api/license_plate', licenseRouter)
app.use('/api/access_history', accessRouter)
app.use('/api/detection_history', detectionRouter)
// app.use('/api/organization', organizationRouter)
// app.use('/api/admin', adminRouter)
// run yarn start
app.get('/test', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Core API is running on ${PORT}`)
})
