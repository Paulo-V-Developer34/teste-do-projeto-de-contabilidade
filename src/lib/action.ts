'use server'

import { redirect } from "next/navigation";
import prisma from "./prisma";
import { FormState } from "./types";
import bcrypt from "bcryptjs";

export async function login(
    prevState: FormState | null,
    formData: FormData
){
    const userEmail = formData.get("email") as string
    const userPassword = formData.get("password") as string

    if (!userEmail || !userPassword){
        return {
            message: 'Falha na validação do servidor',
            errors: {
                userName: ['userName não conseguiu ser enviado']
            }
        }
    }

    const user = await prisma.user.findUnique({
        where: {
            email: userEmail
        }
    })

    if (!user){
        return {
            message: 'Senha ou usuário incorreto',
            errors: {
                userName: ['conta não foi encontrada no banco']
            }
        }
    }

    const passwordCheck = await bcrypt.compare(userPassword, user.password)

    if (!passwordCheck){
        return {
            message: 'Senha ou usuário incorreto',
            errors: {
                userName: ['conta não foi encontrada no banco']
            }
        }
    }else{
        redirect("/home")
    }


}