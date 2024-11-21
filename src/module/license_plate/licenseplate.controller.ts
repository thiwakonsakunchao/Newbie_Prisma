import { License_Plate, Prisma } from '@prisma/client'
import { Request, Response } from 'express'
import { PrismaHelper } from '../../utils'
import { prisma } from '../../utils/prisma'
import { log } from 'console'

const db = prisma.license_Plate

export const getAllLicense = async ( req: Request, res: Response ): Promise<void> => {
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

export const getLicenseById = async ( req: Request, res: Response ): Promise<void> => {
    
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

export const createLicense = async ( req: Request, res: Response ): Promise<void> => {
    
        const { first_name, last_name, license_number, provinceId } = req.body;

    try {
        const data = await db.create({
            data: {
                first_name,
                last_name,
                license_number,
                provinceId
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

export const updateLicense = async ( req: Request, res: Response ): Promise<void> => {

    const { id } = req.params
    const { first_name, last_name, license_number, provinceId } = req.body;

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
                first_name,
                last_name,
                license_number,
                provinceId
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

export const deleteLicense = async ( req: Request, res: Response ): Promise<void> => {
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