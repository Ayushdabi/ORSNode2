const Student = require('../bean/student-bean');

const addStudent = (studentData) => {
    const newStudent = new Student(studentData);
    return newStudent.save()
        .then(savedStudent => ({ student: savedStudent, message: 'Student added successfully' }))
        .catch(error => { throw new Error(error.message); });
};

const updateStudent = (studentId, updateData) => {
    return Student.findByIdAndUpdate(studentId, updateData, { new: true })
        .then(updatedStudent => {
            if (!updatedStudent) throw new Error('Student not found');
            return updatedStudent;
        })
        .catch(error => { throw new Error(error.message); });
};

const deleteStudent = (studentId) => {
    return Student.findByIdAndDelete(studentId)
        .then(deletedStudent => {
            if (!deletedStudent) throw new Error('Student not found');
            return { message: 'Student deleted successfully' };
        })
        .catch(error => { throw new Error(error.message); });
};

const getStudentById = (studentId) => {
    return Student.findById(studentId)
        .then(student => {
            if (!student) throw new Error('Student not found');
            return student;
        })
        .catch(error => { throw new Error(error.message); });
};

const searchStudents = async (query, page, limit) => {
    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
        .skip((page - 1) * limit)
        .limit(limit);
    return { total, students };
};

const countStudents = async (query) => {
    return await Student.countDocuments(query);
};
module.exports = {
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
    countStudents,
    searchStudents

};