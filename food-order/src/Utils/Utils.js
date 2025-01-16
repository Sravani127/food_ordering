export const calculateOrdersBonus = (orderData) => {
  const today = new Date();
  const todayOrders = orderData.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return (
      orderDate.getDate() === today.getDate() &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear()
    );
  });
  const todayTotalBill = todayOrders.reduce(
    (total, order) => total + parseFloat(order.totalBill),
    0
  );

  let bonus = 0;

  // Bonus based on the number of orders today
  if (todayOrders.length % 10 === 0) {
    bonus += todayOrders.length / 2;
  }
  // Bonus based on the total bill today
  if (todayTotalBill >= 500) {
    bonus += todayTotalBill * 0.02;
  }

  return bonus;
};

export const calculateBonus = (workingHoursData) => {
  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7); // Get the date of 7 days ago

  let totalWorkingHoursLastWeek = workingHoursData.reduce((total, entry) => {
    const entryDate = new Date(entry.date);
    return entryDate >= lastWeek &&
      entryDate.getDay() >= 1 &&
      entryDate.getDay() <= 7
      ? total + parseInt(entry.totalHours)
      : total;
  }, 0);

  const totalBonus =
    totalWorkingHoursLastWeek >= 50
      ? workingHoursData.reduce((total, entry) => {
          const entryDate = new Date(entry.date);
          return entryDate >= lastWeek &&
            entryDate.getDay() >= 1 &&
            entryDate.getDay() <= 7
            ? total + parseInt(entry.salary)
            : total;
        }, 0) * 0.04
      : 0;

  return today.getDay() === 5 ? totalBonus : 0;
  //return totalBonus;
};

export const calculateBillDiscount = (userDetails,totalPrice) => {

  let discount = 0;
  let orderDate = new Date().getDate();
  let orderMonth = new Date().getMonth();

  const userDob = userDetails?.dob;
  const userDobMonth = new Date(userDob).getMonth();
  const userDobDate = new Date(userDob).getDate() + 1;

  if(orderDate === userDobDate && orderMonth === userDobMonth){
    discount = discount + 0.2;
  }

  if (totalPrice >= 300) {
    discount += 0.1; // 10% discount
  } else if (totalPrice >= 200) {
    discount += 0.075; // 7.5% discount
  } else if (totalPrice >= 100) {
    discount += 0.05; // 5% discount
  }
  return discount * totalPrice;
};

export const isValidDate = (dateString) => {
  const [year, month, day] = dateString.split("-").map(Number);
  return (
    new Date(year, month - 1, day).toISOString().slice(0, 10) === dateString
  );
};

export const compareTodayWithInputDate = (inputDate) => {
  const today = new Date();
  const inputDateObj = new Date(inputDate);
  const inputDay = inputDateObj.getDate();
  const inputMonth = inputDateObj.getMonth() + 1; // Month is zero-based, so we add 1

  const todayDay = today.getDate();
  const todayMonth = today.getMonth() + 1; // Month is zero-based, so we add 1

  return todayDay === inputDay && todayMonth === inputMonth;
};

export const calculateDistanceCharge = (distance) => {
  if (distance < 5) {
    return 0;
  } else if (distance >= 5 && distance < 10) {
    return 3;
  } else if (distance >= 10 && distance < 15) {
    return 6;
  } else if (distance >= 15 && distance < 20) {
    return 9;
  }
};

export const getOrdersTenBonus = (orders) => {
  const currentDate = new Date();
  const today = currentDate.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
  const monday = new Date(currentDate);
  monday.setDate(currentDate.getDate() - (today === 0 ? 6 : today - 1)); // Go back to Monday of the current week

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6); // Sunday of the current week

  // Count the number of orders
  const totalOrders = orders.filter(order => new Date(order.createdAt) >= new Date(monday) && new Date(order.createdAt) <= new Date(sunday) && order.status === "Paid").length;

  // Check if total orders are 10 or above
  return totalOrders >= 9 ? 100 : 0
};

export const isSameWeekMondayToSunday = (date) => {
  const newDate = new Date(date)
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Set to Monday of current week
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to Sunday of current week
  endOfWeek.setHours(23, 59, 59, 999);

  console.log(newDate >= startOfWeek && newDate <= endOfWeek)
  return newDate >= startOfWeek && newDate <= endOfWeek;
}