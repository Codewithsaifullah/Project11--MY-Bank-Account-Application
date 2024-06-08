#!/usr/bin/env node

import inquirer from "inquirer";
import { faker } from "@faker-js/faker";
import chalk from "chalk";


class Customer {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  phoneNumber: number;
  accountNumber: number;

  constructor(
    firstName: string,
    lastName: string,
    age: number,
    gender: string,
    phoneNumber: number,
    accountNumber: number
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.gender = gender;
    this.phoneNumber = phoneNumber;
    this.accountNumber = accountNumber;
  }
}

interface AccountNum {
  accNumber: number;
  balacne: number;
}

class Bank {
  customer: Customer[] = [];
  bankAccount: AccountNum[] = [];

  addCustomer(obj: Customer) {
    this.customer.push(obj);
  }

  addAccount(obj: AccountNum) {
    this.bankAccount.push(obj);
  }

  transaction(accObj: AccountNum) {
    let newRecord = this.bankAccount.filter(
      (acc) => acc.accNumber !== accObj.accNumber
    );
    this.bankAccount = [...newRecord, accObj];
  }
}

let myBank = new Bank();


for (let i: number = 1; i <= 10; i++) {
  let firstName: string = faker.person.firstName();
  let lastName: string = faker.person.lastName();
  let age: number = parseInt(faker.number.int({ min: 18, max: 60 }).toString());
  let phoneNumber: number = parseInt(faker.helpers.replaceSymbolWithNumber("+923#########"));
  let newCustomer = new Customer(
    firstName,
    lastName,
    age,
    "Male",
    phoneNumber,
    1000 + i
  );
  myBank.addCustomer(newCustomer);
  let randomBalance = Math.floor(Math.random() * 100000);
  myBank.addAccount({
    accNumber: newCustomer.accountNumber,
    balacne: randomBalance,
  });
}


// console.log(myBank);
async function bankService(bank: Bank) {
    console.log(`${chalk.magenta.bold("============================================================")}`)
console.log(`${chalk.cyan.bold.bgBlack
    ("\tWelcome to MyBank Made by Saifullah Ashique")}`)
console.log(`${chalk.magenta.bold("============================================================")}`)
  do {
    let res = await inquirer.prompt([
      {
        name: "ans",
        message: "Please Select a Service that you want to use",
        type: "list",
        choices: ["Balance", "Withdraw", "DepositCash", "Exit"],
      },
    ]);

    // Balance
    if (res.ans == "Balance") {
      let res1 = await inquirer.prompt([
        {
          name: "accountNumber",
          message: "Please Enter your Account Number",
          type: "input",
        },
      ]);
      let accountNumber = myBank.bankAccount.find(
        (acc) => acc.accNumber == res1.accountNumber
      );
      if (accountNumber) {
        let name = myBank.customer.find((item) => item.accountNumber);
        console.log(
          `Dear ${chalk.green.bold(name?.firstName)} ${chalk.green.bold(
            name?.lastName
          )} Your account balance is ${chalk.blue.bold(accountNumber?.balacne)}`
        );
      } else {
        console.log(`${chalk.red.italic("Invalid account number")}`);
      }
    }

    // WithDraw
    if (res.ans == "Withdraw") {
      let res1 = await inquirer.prompt([
        {
          name: "accountNumber",
          message: "Please Enter your Account Number",
          type: "input",
        },
      ]);
      let accountNumber = myBank.bankAccount.find(
        (acc) => acc.accNumber == res1.accountNumber
      );
      if (accountNumber) {
        let name = myBank.customer.find((item) => item.accountNumber);
        console.log(
          `Dear ${chalk.green.bold(name?.firstName)} ${chalk.green.bold(
            name?.lastName
          )} Your account balance is ${chalk.blue.bold(accountNumber?.balacne)}`
        );
        let withdarw = await inquirer.prompt([
          {
            name: "ans",
            message: "How much you want to withdraw from your account:",
            type: "input",
          },
        ]);
        if (withdarw.ans > accountNumber.balacne) {
          console.log(`${chalk.red.italic("Insufficient Balance")}`);
        }
        let newBlance = accountNumber.balacne - parseInt(withdarw.ans);
        myBank.transaction({
          accNumber: accountNumber.accNumber,
          balacne: newBlance,
        });
        console.log(
          `Dear ${chalk.green.bold(name?.firstName)} ${chalk.green.bold(
            name?.lastName
          )} You have withdrawn ${chalk.red.bold(
            withdarw.ans
          )} Now your current Balance is ${chalk.blue.bold(newBlance)}`
        );
      } else {
        console.log(`${chalk.red.italic("Invalid account number")}`);
      }
    }

    // DepositCash
    if (res.ans == "DepositCash") {
      let res1 = await inquirer.prompt([
        {
          name: "accountNumber",
          message: "Please Enter your Account Number",
          type: "input",
        },
      ]);
      let accountNumber = myBank.bankAccount.find(
        (acc) => acc.accNumber == res1.accountNumber
      );
      if (accountNumber) {
        let name = myBank.customer.find((item) => item.accountNumber);
        console.log(
          `Dear ${chalk.green.bold(name?.firstName)} ${chalk.green.bold(
            name?.lastName
          )} Your account balance is ${chalk.blue.bold(accountNumber?.balacne)}`
        );
        let depost = await inquirer.prompt([
          {
            name: "ans",
            message: "How much you want to Depost in your account:",
            type: "input",
          },
        ]);
        let newBlance:number = accountNumber.balacne + parseInt(depost.ans);
        myBank.transaction({
          accNumber: accountNumber.accNumber,
          balacne: newBlance,
        });
        console.log(
          `Dear ${chalk.green.bold(name?.firstName)} ${chalk.green.bold(
            name?.lastName
          )} You have Depost ${chalk.yellowBright.bold(
            depost.ans
          )} Now your current Balance is ${chalk.blue.bold(newBlance)}`
        );
      } else {
        console.log(`${chalk.red.italic("Invalid account number")}`);
      }
    }

    // Exist
    if (res.ans == "Exit") {
      console.log(`${chalk.bgRed.italic("Thank you for using our service")}`);
      process.exit();
    }
  } while (true);
}

bankService(myBank);
