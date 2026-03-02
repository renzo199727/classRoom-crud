const db = require('_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await db.Classroom.findAll();
}

async function getById(id) {
    return await getClassroom(id);
}

async function create(params) {

    // Example: prevent duplicate classroom name + section
    if (await db.Classroom.findOne({ 
        where: { 
            name: params.name,
            section: params.section
        } 
    })) {
        throw `Classroom "${params.name} - ${params.section}" already exists`;
    }

    const classroom = new db.Classroom(params);
    await classroom.save();
}

async function update(id, params) {

    const classroom = await getClassroom(id);

    // Optional: check duplicate on update
    if (params.name && params.section) {
        const existing = await db.Classroom.findOne({
            where: {
                name: params.name,
                section: params.section
            }
        });

        if (existing && existing.id !== classroom.id) {
            throw `Classroom "${params.name} - ${params.section}" already exists`;
        }
    }

    Object.assign(classroom, params);
    await classroom.save();
}

async function _delete(id) {
    const classroom = await getClassroom(id);
    await classroom.destroy();
}

async function getClassroom(id) {
    const classroom = await db.Classroom.findByPk(id);
    if (!classroom) throw 'Classroom not found';
    return classroom;
}