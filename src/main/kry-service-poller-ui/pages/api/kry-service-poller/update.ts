import type { NextApiRequest, NextApiResponse } from 'next'
import { externalServicesHttpClient } from '../../../services/httpService'
import { endpoints } from '../../../config'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PUT') {
    try {
      const updatedService = await externalServicesHttpClient.put(endpoints.servicePollerEndpoint, req.body)
      console.log(updatedService.data)
      res.status(200)
      res.json(updatedService.data)
      return
    } catch (error) {
      console.log('ERROR OCURRED WHILE UPDATING SERVICE: ', error)
      res.status(500)
      res.json({ error: 'The following error while updating the service', errorMsg: error })
      return
    }
  }
  res.status(404)
  res.json({ error: 'Method not allowed' })
  return
}
