export const BLOCKS = [
  {
    id: 1,
    chain: 1,
    nonce: 11316,
    data: "",
    previous:
      "0000000000000000000000000000000000000000000000000000000000000000",
  },
  {
    id: 2,
    chain: 1,
    nonce: 35230,
    data: "",
    previous:
      "000015783b764259d382017d91a36d206d0600e2cbb3567748f46a33fe9297cf",
  },
  {
    id: 3,
    chain: 1,
    nonce: 12937,
    data: "",
    previous:
      "000012fa9b916eb9078f8d98a7864e697ae83ed54f5146bd84452cdafd043c19",
  },
  {
    id: 4,
    chain: 1,
    nonce: 35990,
    data: "",
    previous:
      "0000b9015ce2a08b61216ba5a0778545bf4ddd7ceb7bbd85dd8062b29a9140bf",
  },
  {
    id: 5,
    chain: 1,
    nonce: 56265,
    data: "",
    previous:
      "0000ae8bbc96cf89c68be6e10a865cc47c6c48a9ebec3c6cad729646cefaef83",
  },
];

export const TOKENS = (chain: number) => [
  {
    id: 1,
    chain,
    nonce: 139358,
    data: [
      { value: "25.00", from: "Darcy", to: "Bingley" },
      { value: "4.27", from: "Elizabeth", to: "Jane" },
      { value: "19.22", from: "Wickham", to: "Lydia" },
      { value: "106.44", from: "Lady Catherine de Bourgh", to: "Collins" },
      { value: "6.42", from: "Charlotte", to: "Elizabeth" },
    ],
    previous:
      "0000000000000000000000000000000000000000000000000000000000000000",
  },
  {
    id: 2,
    chain,
    nonce: 39207,
    data: [
      { value: "97.67", from: "Ripley", to: "Lambert" },
      { value: "48.61", from: "Kane", to: "Ash" },
      { value: "6.15", from: "Parker", to: "Dallas" },
      { value: "10.44", from: "Hicks", to: "Newt" },
      { value: "88.32", from: "Bishop", to: "Burke" },
      { value: "45.00", from: "Hudson", to: "Gorman" },
      { value: "92.00", from: "Vasquez", to: "Apone" },
    ],
    previous:
      "00000c52990ee86de55ec4b9b32beefd745d71675dc0eddfbc7b88336e2e296b",
  },
  {
    id: 3,
    chain,
    nonce: 13804,
    data: [
      { value: "10.00", from: "Emily", to: "Jackson" },
      { value: "5.00", from: "Madison", to: "Jackson" },
      { value: "20.00", from: "Lucas", to: "Grace" },
    ],
    previous:
      "000078be183417844c14a9251ca246fb15df1074019873f5d85c1a6f4311d4e0",
  },
  {
    id: 4,
    chain,
    nonce: 20688,
    data: [
      { value: "62.19", from: "Rick", to: "Ilsa" },
      { value: "867.96", from: "Captain Louis Renault", to: "Strasser" },
      { value: "276.15", from: "Victor Laszlo", to: "Ilsa" },
      { value: "97.13", from: "Rick", to: "Sam" },
      { value: "119.63", from: "Captain Louis Renault", to: "Jan Brandel" },
    ],
    previous:
      "0000c2c95f54a49b4f2bee7056a7dc3b7c1a408706c848b520e20eac75aaceb0",
  },
  {
    id: 5,
    chain,
    nonce: 33083,
    data: [
      { value: "14.12", from: "Denise Lovett", to: "Edmund Lovett" },
      { value: "2,760.29", from: "Lord Glendenning", to: "John Moray" },
      { value: "413.78", from: "Katherine Glendenning", to: "Miss Audrey" },
    ],
    previous:
      "0000c03019ed59586405750968888fb65256e82492480d9fe0a6bd2f5e86b5ca",
  },
];

export const COINS = (chain: number) => [
  {
    id: 1,
    chain,
    nonce: 16651,
    coinbasevalue: "100.00",
    coinbaseto: "Anders",
    txs: [],
    previous:
      "0000000000000000000000000000000000000000000000000000000000000000",
  },
  {
    id: 2,
    chain,
    nonce: 215458,
    coinbasevalue: "100.00",
    coinbaseto: "Anders",
    txs: [
      { value: "10.00", from: "Anders", to: "Sophia" },
      { value: "20.00", from: "Anders", to: "Lucas" },
      { value: "15.00", from: "Anders", to: "Emily" },
      { value: "15.00", from: "Anders", to: "Madison" },
    ],
    previous:
      "0000438d7625b86a6f366545b1929975a0d3ff1f8847e56cc587cadddb0ab781",
  },
  {
    id: 3,
    chain,
    nonce: 146,
    coinbasevalue: "100.00",
    coinbaseto: "Anders",
    txs: [
      { value: "10.00", from: "Emily", to: "Jackson" },
      { value: "5.00", from: "Madison", to: "Jackson" },
      { value: "20.00", from: "Lucas", to: "Grace" },
    ],
    previous:
      "0000baeab68c2a60f9a6fa56355438d97c672a15494fcea617064d9314f9ff63",
  },
  {
    id: 4,
    chain,
    nonce: 18292,
    coinbasevalue: "100.00",
    coinbaseto: "Anders",
    txs: [
      { value: "15.00", from: "Jackson", to: "Ryan" },
      { value: "5.00", from: "Emily", to: "Madison" },
      { value: "8.00", from: "Sophia", to: "Jackson" },
    ],
    previous:
      "0000df1d632b734f5a5fc126a0f0e8894fb4c8314ba7086b62980559af6771b9",
  },
  {
    id: 5,
    chain,
    nonce: 108899,
    coinbasevalue: "100.00",
    coinbaseto: "Sophia",
    txs: [
      { value: "2.00", from: "Jackson", to: "Alexander" },
      { value: "6.00", from: "Ryan", to: "Carter" },
      { value: "4.00", from: "Ryan", to: "Riley" },
      { value: "9.95", from: "Grace", to: "Katherine" },
    ],
    previous:
      "0000c694336f88129f3685bd3ba5d67c445dfd8d18bd22f5d87301dd560eb30e",
  },
];
