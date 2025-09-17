import NewPost from "@/components/FatoForm"
import prisma from "@/lib/prisma"

export default async function Dashboard(){
    const fatos = await prisma.fatos.findMany({
        include: {
            author: true
        }
    })

    return (
        <>
            <h1>Dashboard</h1>
            {
                fatos && fatos.map((fato)=>(
                    <div key={fato.id} className="max-w-md mx-auto my-4 p-6 bg-white rounded-xl shadow-md space-y-2">
                        <h1 className="text-2xl font-bold text-gray-900">{fato.title}</h1>
                        <h2 className="text-md font-medium text-indigo-600">Autor: {fato.author.name}</h2>
                        <p className="text-gray-700 text-lg">R$ {fato.value}</p>
                        <p className="text-sm text-gray-500">{fato.published ? 'Publicado' : 'Rascunho'}</p>
                    </div>
                ))
            }
            <NewPost/>
        </>
    )
}