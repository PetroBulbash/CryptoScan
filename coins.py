#https://github.com/Swyftx/crypto-address-validator

coins = [
    {"Name": 'Bitcoin public address',
     "ticker": 'btc',
     "Patterns": [b'1[a-km-zA-HJ-NP-Z1-9]{25,34}', b'1\x00([a-km-zA-HJ-NP-Z1-9]\x00){25,34}'],
     "Byte_length": 25,
     "Validating": True},

    {"Name": 'Bitcoin P2SH public address',
     "ticker": 'btc',
     "Patterns": [b'3[a-km-zA-HJ-NP-Z1-9]{25,34}', b'3\x00([a-km-zA-HJ-NP-Z1-9]\x00){25,34}'],
     "Byte_length": 25,
     "Validating": True},

    {"Name": 'Bitcoin BIP38 Encrypted Private Key',
     "ticker": 'btc',
     "Patterns": [b'6P[a-km-zA-HJ-NP-Z1-9]{56}', b'6\x00P\x00([a-km-zA-HJ-NP-Z1-9]\x00){56}'],
     "Byte_length": 43,
     "Validating": True},

    {"Name": 'Bitcoin WIF Private key, uncompressed public keys',
     "ticker": 'btc',
     "Patterns": [b'5[a-km-zA-HJ-NP-Z1-9]{50}', b'5\x00([a-km-zA-HJ-NP-Z1-9]\x00){50}'],
     "Byte_length": 37,
     "Validating": True},

    {"Name": 'Bitcoin WIF Private key, compressed public keys',
     "ticker": 'btc',
     "Patterns": [b'[KL][a-km-zA-HJ-NP-Z1-9]{51}', b'[KL]\x00([a-km-zA-HJ-NP-Z1-9]\x00){51}'],
     "Byte_length": 38,
     "Validating": True},

    {"Name": 'Bitcoin BIP32 HD wallet private node',
     "ticker": 'btc',
     "Patterns": [b'xprv[a-km-zA-HJ-NP-Z1-9]{107,108}', b'x\x00p\x00r\x00v\x00([a-km-zA-HJ-NP-Z1-9]\x00){107,108}'],
     "Byte_length": 82,
     "Validating": True},

    {"Name": 'Bitcoin BIP32 HD wallet public node',
     "ticker": 'btc',
     "Patterns": [b'xpub[a-km-zA-HJ-NP-Z1-9]{107,108}', b'x\x00p\x00u\x00b\x00([a-km-zA-HJ-NP-Z1-9]\x00){107,108}'],
     "Byte_length": 82,
     "Validating": True},

    {"Name": 'Etherium public address',
     "ticker": 'eth',
     "Patterns": [b'0x[a-fA-F0-9]{40}'],
     "Byte_length": -1,
     "Validating": True},

    {"Name": 'Dash public address',
     "ticker": 'dash',
     "Patterns": [b'X[1-9A-HJ-NP-Za-km-z]{33}'],
     "Byte_length": -1,
     "Validating": True},

    {"Name": 'Dogecoin public address',
     "ticker": 'doge',
     "Patterns": [b'D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}'],
     "Byte_length": -1,
     "Validating": True},

    {"Name": 'Litecoin public address',
     "ticker": 'ltc',
     "Patterns": [b'[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}'],
     "Byte_length": -1,
     "Validating": True},

    {"Name": 'Monero public address',
     "ticker": 'xmr',
     "Patterns": [b'4[0-9AB][1-9A-HJ-NP-Za-km-z]{93}'],
     "Byte_length": -1,
     "Validating": False},

    {"Name": 'NEO public address',
     "ticker": 'neo',
     "Patterns": [b'A[0-9a-zA-Z]{33}'],
     "Byte_length": -1,
     "Validating": True},

    {"Name": 'Ripple public address',
     "ticker": 'xrp',
     "Patterns": [b'r[0-9a-zA-Z]{24,34}'],
     "Byte_length": -1,
     "Validating": True}
]