const { response } = require("express");
const Evento = require('../models/Evento');

const getEventos = async( req, res = response ) => {    

    const eventos = await Evento.find().populate('user','name');


    res.json({
        ok:true,
        eventos
    })

}

const crearEvento = async( req, res = response ) => {    

    const evento = new Evento(req.body);

    try {

        evento.user = req.uid;
        
        const eventoGuardado = await evento.save();

        res.json({
            ok:true,
            evento: eventoGuardado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const actualizarEvento = async( req, res = response ) => {    

    const eventoId = req.params.id;

    try {

        const evento = await Evento.findById(eventoId);
        const uid = req.uid;


        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento con ese id no existe'
            });
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            });
        };

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate( evento.id, nuevoEvento, { new: true } );

        res.json({
            ok: true,
            evento: eventoActualizado
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}


const eliminarEvento = async( req, res = response ) => {    

    const eventoId = req.params.id;

    try {

        const evento = await Evento.findById(eventoId);
        const uid = req.uid;


        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento con ese id no existe'
            });
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            });
        };

        await Evento.findByIdAndDelete( evento.id );

        res.json({
            ok: true
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}


module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}