import { Request, Response } from 'express'
import db from '../database'


class ProblemasComunesController {
    public async getproblemasvending(req: Request, res: Response){
        await db.query(`select * from problemascomunes where tipomaq in ('vending','todas') order by problema`, function(err: any, result: any, fields: any){
            if(err) throw err
            res.json(result)
        })
    }
}

const problemasComunesController = new ProblemasComunesController()
export default problemasComunesController