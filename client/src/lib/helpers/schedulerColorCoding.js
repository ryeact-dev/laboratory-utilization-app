export function getColorCoding(isRegularClass, schedule) {
  let color;

  if (!isRegularClass) {
    color = '#459566'; // Reserved class color
    return color;
  }

  const colorMap = {
    1: '#2866df',
    2: '#ec2c40',
    3: '#e3ce2c',
  };

  color = colorMap[Number(schedule)];

  return color;
}
