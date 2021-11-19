import type { NextApiRequest, NextApiResponse } from 'next'
import { externalServicesHttpClient } from '../../../services/httpService'
import { endpoints } from '../../../config'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const createdService = await externalServicesHttpClient.post(endpoints.servicePollerEndpoint, req.body)
      console.log(createdService.data)
      res.status(200)
      res.json(createdService.data)
      return
    } catch (error) {
      console.log('ERROR OCURRED WHILE CREATING SERVICE: ', error)
      res.status(500)
      res.json({ error: 'The following error while creating the service', errorMsg: error })
      return
    }
  }
  res.status(404)
  res.json({ error: 'Method not allowed' })
  return
}
