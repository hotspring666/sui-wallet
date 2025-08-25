# Sui Wallet Web Application

This is a web application for interacting with the Sui blockchain. It provides functionalities such as viewing wallet balances, exploring addresses, and sending transactions on the Testnet.

## Features

- Connect to various Sui wallets.
- View SUI and other token balances for any address.
- View NFTs for any address.
- Switch between Mainnet and Testnet.
- Send SUI tokens on the Testnet.
- Request SUI from the Testnet faucet.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Material-UI (MUI), Sui DApp Kit
- **Backend**: Node.js, Express, TypeScript, Sui.js SDK

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1.  Clone the repository:
    ```sh
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```sh
    cd sui-wallet
    ```
3.  Install all dependencies for both the frontend and backend:
    ```sh
    npm install
    ```

### Running the Application

This project is configured to run both the frontend and backend servers concurrently with a single command.

1.  Start the development servers:
    ```sh
    npm run dev
    ```
2.  This command will:
    - Start the frontend Vite server on `http://localhost:5173`.
    - Start the backend Node.js server on `http://localhost:3001`.
3.  Open your browser and navigate to `http://localhost:5173` to use the application.
