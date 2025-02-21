import * as Yup from 'yup'

const signUpSchema = Yup.object({
    codigo: Yup.string().max(25).required('Se necesita un codigo'),
    nombre: Yup.string().required('Se necesita un nombre!'),
    apellido: Yup.string().required('Se necesita un apellido!'),
    correo: Yup.string().email('Se necesita un correo valido').required('Se necesita un correo!'),
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
    perfil_egreso: Yup.string().nullable(),
    departamento: Yup.number().nullable()
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

const alumnoSchema = Yup.object({
    id: Yup.number().required(),
    codigo: Yup.string().max(25).required('Se necesita un codigo'),
    nombre: Yup.string().required(),
    apellido: Yup.string().required(),
    correo: Yup.string().email("Se necesita un correo valido").required(),
    carrera: Yup.string().required(),
    centro: Yup.string().required(),
    situacion: Yup.number().required(),
    telefono: Yup.string().nullable()
})

const maestroSchema = Yup.object({
    id: Yup.number().required(),
    codigo: Yup.string().max(25).required('Se necesita un codigo'),
    nombre: Yup.string().required(),
    apellido: Yup.string().required(),
    correo: Yup.string().email("Se necesita un correo valido").required(),
    carrera: Yup.string().required(),
    centro: Yup.string().required(),
    situacion: Yup.number().required(),
    telefono: Yup.string().nullable(),
    academia: Yup.number().nullable(),
    departamento: Yup.number().nullable()
})

export {signUpSchema, loginSchema, programaSchema, materiaSchema, alumnoSchema, maestroSchema}