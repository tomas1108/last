function generateGroupID(user_id){
    const randomNumber = Math.floor(Math.random() * 10000);
    const formattedNumber = randomNumber.toString().padStart(4, "0");
    return formattedNumber + "-" + user_id;
}

export { generateGroupID }