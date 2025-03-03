function userRoleStep(userRole) {
  const USER_ROLE_STEP = {
    Custodian: 1,
    Faculty: 2,
    'Program Head': 2,
    Dean: 3,
  };

  return (userStep = USER_ROLE_STEP[userRole]);
}

const CAN_ACKNOWLEDGE_USERS = ['Faculty', 'Dean', 'Program Head', 'Custodian'];

exports.userRoleStep = userRoleStep;
exports.CAN_ACKNOWLEDGE_USERS = CAN_ACKNOWLEDGE_USERS;
