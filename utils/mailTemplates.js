exports.signUpTemplate = (verifyLink,firstName)=>{
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Havenlist </title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333333;
                background-color: #2c2c2c; /* Dark background */
                margin: 0;
                padding: 0;
            }
            .container {
                width: 80%;
                margin: 20px auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 10px;
                box-shadow: 0 0 10px rgb(40, 142, 167);
                background-color: #f4f4f4; /* Light grey background */
            }
            .header {
                background:rgb(74, 92, 248);
                padding: 20px;
                text-align: center;
                border-bottom: 1px solid #ddd;
                color: #ffffff;
                border-radius: 10px 10px 0 0;
            }
            .content {
                padding: 20px;
                color: #333333;
            }
            .button-container {
                text-align: center;
                margin: 20px 0;
            }
            .button {
                display: inline-block;
                background-color:rgb(40, 142, 167); /* Green background */
                color: #ffffff;
                padding: 15px 30px;
                font-size: 18px;
                text-decoration: none;
                border-radius: 5px;
                box-shadow: 0 4px 6px rgb(40, 142, 167);
                transition: background-color 0.3s ease;
            }
            .button:hover {
                background-color:rgb(11, 58, 119);
            }
            .footer {
                background:rgb(74, 92, 248);
                padding: 10px;
                text-align: center;
                border-top: 1px solid #ddd;
                font-size: 0.9em;
                color: #cccccc;
                border-radius: 0 0 10px 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Havenlist</h1>
            </div>
            <div class="content">
                <p>Hello ${firstName},</p>
                <p>Thank you for signing up on Havenlist. We are excited to have you on board.</p>
                <p>Please click the button below to verify your account:</p>
                <div class="button-container">
                    <a href="${verifyLink}" class="button">Verify My Account</a>
                </div>
                <p>If you did not sign up on our platform, kindly ignore this email.</p>
                <p>Best regards,<br>Havenlist team</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} . All rights reserved.</p>
            </div>  
        </div>
    </body>
    </html>
    
  
    `
}



exports.forgotTemplate = (firstName, otp, link)=>{
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Havenlist </title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333333;
                background-color: #2c2c2c; /* Dark background */
                margin: 0;
                padding: 0;
            }
            .container {
                width: 80%;
                margin: 20px auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 10px;
                box-shadow: 0 0 10px rgb(40, 142, 167);
                background-color: #f4f4f4; /* Light grey background */
            }
            .header {
                background:rgb(74, 92, 248);
                padding: 20px;
                text-align: center;
                border-bottom: 1px solid #ddd;
                color: #ffffff;
                border-radius: 10px 10px 0 0;
            }
            .content {
                padding: 20px;
                color: #333333;
            }
            .button-container {
                text-align: center;
                margin: 20px 0;
            }
            .button {
                display: inline-block;
                background-color:rgb(40, 142, 167); /* Green background */
                color: #ffffff;
                padding: 15px 30px;
                font-size: 18px;
                text-decoration: none;
                border-radius: 5px;
                box-shadow: 0 4px 6px rgb(40, 142, 167);
                transition: background-color 0.3s ease;
            }
            .button:hover {
                background-color:rgb(11, 58, 119);
            }
            .footer {
                background:rgb(74, 92, 248);
                padding: 10px;
                text-align: center;
                border-top: 1px solid #ddd;
                font-size: 0.9em;
                color: #cccccc;
                border-radius: 0 0 10px 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Havenlist</h1>
            </div>
            <div class="content">
                <p>Hello ${firstName},</p>
                <p>You performed an action in adhere to forgetting your password.</p>
                <p>Your OTP for resetting your password is <strong>${otp}</strong>. It is valid for 15 minutes.</p>
                <div class="button-container">
                <a href="${link}" class="button">verify OTP</a>
                </div>
                <p>If you did not initiate this action on our platform, kindly ignore this email.</p>
                <p>Best regards,<br>Team Havenlist</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} . All rights reserved.</p>
            </div>  
        </div>
    </body>
    </html>
    
    `
}




exports.adminTemplate = (firstName, verifyLink)=>{
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Havenlist </title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333333;
                background-color: #2c2c2c; /* Dark background */
                margin: 0;
                padding: 0;
            }
            .container {
                width: 80%;
                margin: 20px auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 10px;
                box-shadow: 0 0 10px rgb(40, 142, 167);
                background-color: #f4f4f4; /* Light grey background */
            }
            .header {
                background:rgb(74, 92, 248);
                padding: 20px;
                text-align: center;
                border-bottom: 1px solid #ddd;
                color: #ffffff;
                border-radius: 10px 10px 0 0;
            }
            .content {
                padding: 20px;
                color: #333333;
            }
            .button-container {
                text-align: center;
                margin: 20px 0;
            }
            .button {
                display: inline-block;
                background-color:rgb(40, 142, 167); /* Green background */
                color: #ffffff;
                padding: 15px 30px;
                font-size: 18px;
                text-decoration: none;
                border-radius: 5px;
                box-shadow: 0 4px 6px rgb(40, 142, 167);
                transition: background-color 0.3s ease;
            }
            .button:hover {
                background-color:rgb(11, 58, 119);
            }
            .footer {
                background:rgb(74, 92, 248);
                padding: 10px;
                text-align: center;
                border-top: 1px solid #ddd;
                font-size: 0.9em;
                color: #cccccc;
                border-radius: 0 0 10px 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Havenlist</h1>
            </div>
            <div class="content">
                <p>Hello Admin ${firstName},</p>
                <p>You're welcome onboard.</p>
                <p>We at havenlist strive to being the best at serving our clients one day at a time.</p>
                <p>Please click the button below to verify your account:</p>
                <div class="button-container">
                    <a href="${verifyLink}" class="button">Verify My Account</a>
                </div>
                <p>If you did not sign up on our platform, kindly ignore this email.</p>
                <p>Best regards,<br>Havenlist team</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} . All rights reserved.</p>
            </div>  
        </div>
    </body>
    </html>
    
    `
}





exports.tenentRentMessage = (amountPaid, remainingBalance, tenantName)=>{
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Havenlist </title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333333;
                background-color: #2c2c2c; /* Dark background */
                margin: 0;
                padding: 0;
            }
            .container {
                width: 80%;
                margin: 20px auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 10px;
                box-shadow: 0 0 10px rgb(40, 142, 167);
                background-color: #f4f4f4; /* Light grey background */
            }
            .header {
                background:rgb(74, 92, 248);
                padding: 20px;
                text-align: center;
                border-bottom: 1px solid #ddd;
                color: #ffffff;
                border-radius: 10px 10px 0 0;
            }
            .content {
                padding: 20px;
                color: #333333;
            }
            .button-container {
                text-align: center;
                margin: 20px 0;
            }
            .button {
                display: inline-block;
                background-color:rgb(40, 142, 167); /* Green background */
                color: #ffffff;
                padding: 15px 30px;
                font-size: 18px;
                text-decoration: none;
                border-radius: 5px;
                box-shadow: 0 4px 6px rgb(40, 142, 167);
                transition: background-color 0.3s ease;
            }
            .button:hover {
                background-color:rgb(11, 58, 119);
            }
            .footer {
                background:rgb(74, 92, 248);
                padding: 10px;
                text-align: center;
                border-top: 1px solid #ddd;
                font-size: 0.9em;
                color: #cccccc;
                border-radius: 0 0 10px 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Havenlist</h1>
            </div>
            <div class="content">
              <p>Thank you for your payment of <strong>₦${amountPaid}</strong> for the property you rented.</p>
              <p>Your remaining balance to be paid is <strong>₦${remainingBalance}</strong>.</p>
              <p>We appreciate your prompt payment.</p>
              <p>Best regards,<br>HavenList Team</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} . All rights reserved.</p>
            </div>  
        </div>
    </body>
    </html>
    
    `
}




exports.landlordRentMessage = (amountPaid, remainingBalance, landlordName)=>{
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Havenlist </title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333333;
                background-color: #2c2c2c; /* Dark background */
                margin: 0;
                padding: 0;
            }
            .container {
                width: 80%;
                margin: 20px auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 10px;
                box-shadow: 0 0 10px rgb(40, 142, 167);
                background-color: #f4f4f4; /* Light grey background */
            }
            .header {
                background:rgb(74, 92, 248);
                padding: 20px;
                text-align: center;
                border-bottom: 1px solid #ddd;
                color: #ffffff;
                border-radius: 10px 10px 0 0;
            }
            .content {
                padding: 20px;
                color: #333333;
            }
            .button-container {
                text-align: center;
                margin: 20px 0;
            }
            .button {
                display: inline-block;
                background-color:rgb(40, 142, 167); /* Green background */
                color: #ffffff;
                padding: 15px 30px;
                font-size: 18px;
                text-decoration: none;
                border-radius: 5px;
                box-shadow: 0 4px 6px rgb(40, 142, 167);
                transition: background-color 0.3s ease;
            }
            .button:hover {
                background-color:rgb(11, 58, 119);
            }
            .footer {
                background:rgb(74, 92, 248);
                padding: 10px;
                text-align: center;
                border-top: 1px solid #ddd;
                font-size: 0.9em;
                color: #cccccc;
                border-radius: 0 0 10px 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Havenlist</h1>
            </div>
            <div class="content">
              <p>Dear ${landlordName},</p>
              <p>We are pleased to inform you that a tenant has made a payment of <strong>₦${amountPaid}</strong> for your property.</p>
              <p>The remaining balance to be paid by the tenant is <strong>₦${remainingBalance}</strong>.</p>
              <p>Thank you for using HavenList.</p>
              <p>Best regards,<br>HavenList Team</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} . All rights reserved.</p>
            </div>  
        </div>
    </body>
    </html>
    
    `
}
