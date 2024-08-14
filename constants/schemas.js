import * as Yup from 'yup'

const signUpSchema = Yup.object({
    nombre: Yup.string().required('Se necesita un nombre!'),
    apellido: Yup.string().required('Se necesita un apellido!'),
    correo: Yup.string().email('Se necesita un correo valido').required('Se necesita un correo!'),
    codigo: Yup.number().required(),
    rol: Yup.number().required(),
    password: Yup.string().required("Se necesita una contraseña!"),
    passwordConfirm: Yup.string().oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
})

const loginSchema = Yup.object({
    correo: Yup.string().required('Se necesita un correo!'),
    password: Yup.string().required('Se necesita una contraseña!')
})

const programaSchema = Yup.object({
    clave: Yup.number(),
    nombre: Yup.string().required('Se necesita un nombre'),
    tipo: Yup.string(), 
    creditos: Yup.number(),
    requisito: Yup.number().nullable(),
    simultaneo: Yup.number().nullable(),
    horas_practica: Yup.number().required('Se necesitan horas de practica'),
    horas_curso: Yup.number().required('Se necesitan horas de curso'),
    descripcion: Yup.string().nullable(),
    perfil_egreso: Yup.string().nullable()
})

const materiaSchema = Yup.object({
    nrc: Yup.number(),
    programa: Yup.object(),
    dias_clase: Yup.string(),
    hora_inicio: Yup.date(),
    hora_final: Yup.date(),
    edificio: Yup.string().nullable(),
    aula: Yup.number().nullable(),
    profesor: Yup.object().nullable(),
})

export {signUpSchema, loginSchema, programaSchema, materiaSchema}