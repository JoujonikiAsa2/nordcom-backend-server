export const generateTransactionId = () => {
  const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  let trans_Id = "";
  for (let i = 0; i < 10; i++) {
    trans_Id += alphabets.charAt(Math.floor(Math.random() * alphabets.length));
  }
  return trans_Id
};