# procon-ip-react

A responsive UI for the ProCon.IP pool controller based on React.

Feel free to ask questions by using githubs issues system, so others can take
part and are able to find the answer if they have a similar question. Thanks! :)

# Getting Started

## Origins

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

After ejecting, I made the following changes to the build scripts:

- Restrict names of all files and folders to 8:3 for compatibility with the FAT32 file system of the ProCon.IP pool controller.


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000/react/index.htm] to view it in the browser.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
Your app is ready to be deployed!

### deployment

Not yet automated with a script.
So far you can use any ftp client to upload the files and folders from the build folder to your ProCon.IP pool controller.
I recommend creating a folder named 'react' and uploading to that folder. 

## Learn More

For more information see the following links:

* [ProCon.IP - Webbasierte Poolsteuerung / Dosieranlage](https://www.pooldigital.de/shop/poolsteuerungen/procon.ip/35/procon.ip-webbasierte-poolsteuerung-/-dosieranlage)
' [ProCon.IP - Bedienungsanleitung](http://www.pooldigital.de/trm/TRM_ProConIP.pdf)
* [ProCon.IP - Support forum](http://forum.pooldigital.de/)
* [procon-ip - JS library](https://github.com/ylabonte/procon-ip)
* [Disclaimer](#disclaimer)

## Disclaimer

**Just to be clear: I have nothing to do with the development, sellings,
marketing or support of the pool controller unit itself. I just developed a
solution for my personal requirements and make it available to the public for free use.**
