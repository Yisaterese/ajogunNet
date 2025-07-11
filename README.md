# AjogunNet Frontend

A decentralized application for creating and managing digital wills on the Sui blockchain.

## Features

- 🔐 **Secure Wallet Integration** - Connect with Sui Wallet Kit
- 📝 **Will Creation** - Multi-step wizard for creating digital wills
- 👥 **Multiple Heirs** - Support for up to 10 heirs with percentage allocation
- 📊 **Dashboard** - View and manage all your wills
- 🔄 **Real-time Updates** - Live blockchain data integration
- 📱 **Responsive Design** - Works on all devices
- 🌙 **Dark Mode** - Toggle between light and dark themes

## Quick Start

### Prerequisites

- Node.js 18+ 
- Sui Wallet browser extension
- SUI tokens for testing (get from [Sui Testnet Faucet](https://docs.sui.io/guides/developer/getting-started/get-coins))

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd ajogunnet-frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Configure environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Update `.env.local` with your smart contract details:
\`\`\`env
NEXT_PUBLIC_PACKAGE_ID=your_deployed_contract_package_id
NEXT_PUBLIC_NETWORK=testnet
\`\`\`

5. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Smart Contract Integration

### Contract Functions

The app integrates with these smart contract functions:

- `create_will(amount, heirs, percentages, auto_send)` - Creates a new will
- `query_will(owner_address)` - Retrieves wills for an address  
- `revoke_will(will_id)` - Revokes an active will

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_PACKAGE_ID` | Deployed smart contract package ID | Yes |
| `NEXT_PUBLIC_NETWORK` | Sui network (testnet/mainnet/devnet) | No |
| `NEXT_PUBLIC_SUI_RPC_URL` | Custom RPC endpoint | No |

### Demo Mode

If `NEXT_PUBLIC_PACKAGE_ID` is not configured, the app runs in demo mode with:
- Mock data for development
- UI/UX testing without blockchain calls
- Warning messages about contract status

## Architecture

### Key Components

- **SuiProvider** - Wallet and blockchain client setup
- **WillOperations** - Smart contract interaction logic
- **Navigation** - Responsive navigation with wallet connection
- **CreateWill** - Multi-step will creation wizard
- **Dashboard** - Will management interface

### State Management

- React Query for blockchain data caching
- Local state for form management
- Toast notifications for user feedback

### Error Handling

- Comprehensive error boundaries
- Graceful fallbacks for network issues
- User-friendly error messages
- Automatic retry mechanisms

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Manual Deployment

\`\`\`bash
npm run build
npm start
\`\`\`

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Testing

The app includes comprehensive error handling and fallbacks:

- **Network Issues** - Automatic retries and fallback data
- **Contract Errors** - User-friendly error messages
- **Validation** - Real-time form validation
- **Balance Checks** - Insufficient balance warnings

## Security Considerations

- All transactions require wallet signature
- Input validation and sanitization
- Address format verification
- Balance verification before transactions
- No private key handling in frontend

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

- [Sui Documentation](https://docs.sui.io)
- [Sui Discord](https://discord.gg/sui)
- [GitHub Issues](https://github.com/your-repo/issues)
#   a j o g u n N e t  
 