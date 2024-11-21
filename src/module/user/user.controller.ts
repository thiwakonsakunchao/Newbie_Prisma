import { User, Prisma } from '@prisma/client'
import { Request, Response } from 'express'
import { PrismaHelper } from '../../utils'
import { prisma } from '../../utils/prisma'
import { log } from 'console'

const db = prisma.user

export const getAllUser = async ( req: Request, res: Response ): Promise<void> => {
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

export const getUserById = async ( req: Request, res: Response ): Promise<void> => {
    
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

export const createUser = async ( req: Request, res: Response ): Promise<void> => {
    
        const { username, password } = req.body;

    try {
        const data = await db.create({
            data: {
                username,
                password
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

export const updateUser = async ( req: Request, res: Response ): Promise<void> => {

    const { id } = req.params
    const { username, password } = req.body

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
                username,
                password
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

export const deleteUser = async ( req: Request, res: Response ): Promise<void> => {
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