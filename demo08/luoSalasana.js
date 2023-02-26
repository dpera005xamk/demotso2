let hash = require("crypto").createHash("SHA256").update("passu123").digest("hex");
// noden oma crypto paketti, SHA256 on algorytmin nimi, siinäpä passu, mikä selkokielisenä ja sitten hexadesimaalina
// lopputulos
console.log(hash);