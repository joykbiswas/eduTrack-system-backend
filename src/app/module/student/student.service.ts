import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateStudentPayload, IUpdateStudentPayload, IEnrollStudentInClassPayload } from "./student.interface";

const getAllStudents = async () => {
  const students = await prisma.student.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      user: true,
      enrolledClasses: {
        include: {
          class: true,
        },
      },
      assignedTasks: {
        include: {
          task: true,
        },
      },
      progress: true,
    },
  });
  return students;
};

const getStudentById = async (id: string) => {
  const student = await prisma.student.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      user: true,
      enrolledClasses: {
        include: {
          class: {
            include: {
              organization: true,
              teacher: true,
              tasks: true,
              messages: true,
            },
          },
        },
      },
      assignedTasks: {
        include: {
          task: true,
        },
      },
      progress: {
        include: {
          quiz: true,
        },
      },
    },
  });

  if (!student) {
    throw new AppError(status.NOT_FOUND, "Student not found");
  }

  return student;
};

const createStudent = async (userId: string, payload: ICreateStudentPayload) => {
  const isStudentExist = await prisma.student.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (isStudentExist) {
    throw new AppError(status.CONFLICT, "Student with this email already exists");
  }

  const newStudent = await prisma.student.create({
    data: {
      ...payload,
      userId,
    },
    include: {
      user: true,
    },
  });

  return newStudent;
};

const updateStudent = async (id: string, payload: IUpdateStudentPayload) => {
  const isStudentExist = await prisma.student.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!isStudentExist) {
    throw new AppError(status.NOT_FOUND, "Student not found");
  }

  const updatedStudent = await prisma.student.update({
    where: {
      id,
    },
    data: {
      ...payload,
    },
    include: {
      user: true,
      enrolledClasses: true,
    },
  });

  return updatedStudent;
};

const enrollInClass = async (studentId: string, payload: IEnrollStudentInClassPayload) => {
  const student = await prisma.student.findUnique({
    where: {
      id: studentId,
      isDeleted: false,
    },
  });

  if (!student) {
    throw new AppError(status.NOT_FOUND, "Student not found");
  }

  const classExists = await prisma.class.findUnique({
    where: {
      id: payload.classId,
      isDeleted: false,
    },
  });

  if (!classExists) {
    throw new AppError(status.NOT_FOUND, "Class not found");
  }

  const alreadyEnrolled = await prisma.studentClass.findUnique({
    where: {
      studentId_classId: {
        studentId,
        classId: payload.classId,
      },
    },
  });

  if (alreadyEnrolled) {
    throw new AppError(status.CONFLICT, "Student is already enrolled in this class");
  }

  const enrollment = await prisma.studentClass.create({
    data: {
      studentId,
      classId: payload.classId,
    },
    include: {
      student: true,
      class: true,
    },
  });

  return enrollment;
};

const deleteStudent = async (id: string) => {
  const isStudentExist = await prisma.student.findUnique({
    where: {
      id,
    },
  });

  if (!isStudentExist) {
    throw new AppError(status.NOT_FOUND, "Student not found");
  }

  const deletedStudent = await prisma.student.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return deletedStudent;
};

export const StudentService = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  enrollInClass,
  deleteStudent,
};
