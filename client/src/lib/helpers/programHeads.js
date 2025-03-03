export function getProgramHeads(program, instructor) {
  const mapProgramHeads = {
    'BS-ACT': 'Joe Mari Flores',
    'BS-MGTA': 'Jovit Cain',
    'BS-ARTS': 'Rex Sarvida',
    'BS-PSY': 'Louisse Noreen Tapiz',
    'BSBA-FIN': 'Regie Aarron',
    'BSBA-MM': 'Dindo Alquizar',
    'BSBA-HR': 'Riza Mae Narciso',
    'BS-TM': 'Ritchel Villaver',
    'BS-HRM': 'Nexofelo Gono',
    'BS-SEC': 'Armand James Vallejo',
    'BS-ELEM': 'Monalisa Chagas',
    'BS-CS': 'Iris Mendoza',
    'BS-IT': 'Richard Vincent Misa',
    'BS-EE': 'Jerald Mutoc',
    'BS-COE': 'Adel Monette Rivera',
    'BS-ECE': 'Kristine Anne Quirante',
    'BS-CRIM': 'Aimee Aya-ay',
  };

  const mapCourse = {
    'BS-ACT': 'BS Accountancy',
    'BS-MGTA': 'BS Mgt Accounting',
    'BS-ARTS': 'AB English',
    'BS-PSY': 'BS Psychology',
    'BSBA-FIN': 'BSBA-Fin Mgt',
    'BSBA-MM': 'BSBA-Mktg Mgt',
    'BSBA-HR': 'BSBA-HR Mgt',
    'BS-TM': 'Tourism Mgt',
    'BS-HRM': 'BS HRM',
    'BS-SEC': 'BS Secondary Educ',
    'BS-ELEM': 'BS Elementary Educ',
    'BS-CS': 'BS Com Sci',
    'BS-IT': 'BS Info Tech',
    'BS-EE': 'BS Electrical Engg',
    'BS-COE': 'BS Computer Engg',
    'BS-ECE': 'BS Electronics Engg',
    'BS-CRIM': 'BS Criminology',
  };

  let course = mapCourse[program];
  let programHead = mapProgramHeads[program];

  // TODO: UPDATED THIS CODE 04/27/2024
  if (programHead) {
    if (programHead.toLowerCase() === instructor.toLowerCase()) {
      programHead = 'Gina Fe Israel';
      course = 'Dean of College';
      return { programHead, course };
    }
  }

  return { programHead, course };
}
