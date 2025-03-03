const isAllowedUsers = ['Admin', 'Custodian', 'STA', 'Faculty', 'Program Head'];

function isUserAllowed(userRole) {
  const foundRole = isAllowedUsers.findIndex((role) => role === userRole);

  return Boolean(foundRole > -1);
}

exports.isUserAllowed = isUserAllowed;
