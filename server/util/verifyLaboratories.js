function verifyLaboratories(user, laboratory) {
  const { laboratory: laboratories, user_role } = user;

  const response = {
    isError: false,
    message: '',
  };

  if (user_role !== 'Admin' && user_role !== 'Dean') {
    if (!laboratories.includes(laboratory)) {
      response.isError = true;
      response.message = 'Unauthorized Request.';
    }
  }

  return response;
}

exports.verifyLaboratories = verifyLaboratories;
