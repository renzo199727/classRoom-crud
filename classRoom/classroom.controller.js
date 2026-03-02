const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const classroomService = require('./classroom.service');

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

module.exports = router;

function getAll(req, res, next) {
    classroomService.getAll()
        .then(classrooms => res.json(classrooms))
        .catch(next);
}

function getById(req, res, next) {
    classroomService.getById(req.params.id)
        .then(classroom => res.json(classroom))
        .catch(next);
}

function create(req, res, next) {
    classroomService.create(req.body)
        .then(() => res.json({ message: 'Classroom created' }))
        .catch(next);
}

function update(req, res, next) {
    classroomService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'Classroom updated' }))
        .catch(next);
}

function _delete(req, res, next) {
    classroomService.delete(req.params.id)
        .then(() => res.json({ message: 'Classroom deleted' }))
        .catch(next);
}

function createSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        gradeLevel: Joi.string().required(),
        section: Joi.string().required(),
        capacity: Joi.number().integer().required(),
        description: Joi.string().allow('').optional()
    });

    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().empty(''),
        gradeLevel: Joi.string().empty(''),
        section: Joi.string().empty(''),
        capacity: Joi.number().integer().empty(''),
        description: Joi.string().allow('').optional()
    });

    validateRequest(req, next, schema);
}