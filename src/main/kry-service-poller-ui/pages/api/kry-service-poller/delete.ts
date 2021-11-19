import type { NextApiRequest, NextApiResponse } from 'next'
import { externalServicesHttpClient } from '../../../services/httpService'
import { endpoints } from '../../../config'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'DELETE') {
    try {
      const uuid = req.query['uuid']
      const deletedService = await externalServicesHttpClient.delete(`${endpoints.servicePollerEndpoint}?uuid=${uuid}`)
      res.status(200)
      res.json(deletedService.data)
      return
    } catch (error) {
      console.log(error)
      res.status(500)
      res.json({ error: 'Error deleting service', errorMsg: error })
      return
    }
  }
  res.status(404)
  res.json({ error: 'Method not allowed' })
  return
}
