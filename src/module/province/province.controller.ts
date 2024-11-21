import { Province, Prisma } from '@prisma/client'
import { Request, Response } from 'express'
import { PrismaHelper } from '../../utils'
import { prisma } from '../../utils/prisma'

const db = prisma.province

export const getAllProvince = async ( req: Request, res: Response ): Promise<void> => {
    try {
        const data = await db.findMany()
        res.status(200).json({
            message: "Okay La",
            data:{
                data
            }
        })
    } catch (error) {
        res.status(500).json({
            message: "Error Na",
            error
        })
    }
}

export const getProvinceById = async ( req: Request, res: Response ): Promise<void> => {
    
    const { id } = req.params

    try {
        const data = await db.findUnique({
            where: {
                id: id
            }
        })
        if (!data) {
            res.status(404).json({
                message: 'User Not Found'
            })
            return
        }

        res.status(200).json({
            message: 'Okay La',
            data: {
                data
            }
        })
    } catch (error) {
        res.status(500).json({
            message: "Error Na",
            error
        })
    }
}

export const createProvince = async ( req: Request, res: Response ): Promise<void> => {
    
        const { province } = req.body;

    try {
        const data = await db.create({
            data: {
                province
            }
        })

        res.status(200).json({
            message: "create La",
            data
        })

    } catch (error) {
        console.log(req.body);
        
        res.status(500).json({
            message: "Error Na",
            error
        })
    }
}

export const updateProvince = async ( req: Request, res: Response ): Promise<void> => {

    const { id } = req.params
    const { province } = req.body

    try {
        const data = await db.findUnique({
            where: {
                id: id
            }
        })
        
        if (!data) {
            res.status(404).json({
                message: 'Not Found'
            })
            return
        }

       const newDate = await db.update({
            where: {
                id: id
            },
            data:{
                province
            }
        })
        res.status(200).json({
            message: 'Update La',
            newDate
        })
    } catch (error) {   
        res.status(500).json({
            message: "Error Na",
            error
        })
    }
}

export const deleteProvince = async ( req: Request, res: Response ): Promise<void> => {
    const { id } = req.params

    try {
        const data = await db.findUnique({
            where: {
                id: id
            }
        })
        if (!data) {
            res.status(404).json({
                message: 'Not Found',
            })
            return
        }

        const deletedData = await db.delete({
            where: {
                id: id
            }
        })
        res.status(200).json({
            message: 'Delete La',
            deletedData
        })
    } catch (error) {
        res.status(500).json({
            message: "Error Na",
            error
        })
    }
}