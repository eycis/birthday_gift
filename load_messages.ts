import admin from 'firebase-admin';

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
  
  const db = admin.firestore();

const messages = [
    { dayNumber:1, title:"Zpráva pro tebe", body:"mám vás ráda a jste moje oblíbená sluníčka."},
    { dayNumber:2, title:"Zpráva pro tebe", body:"doufám že dnešek bude aspoň trochu milý. kdyby ne tak posílám imaginární objetí."},
    { dayNumber:3, title:"Zpráva pro tebe", body:"pojebte se dementi"},
    { dayNumber:4, title:"Zpráva pro tebe", body:"reminder že na vás myslím a že jste pro mě důležití."},
    { dayNumber:5, title:"Zpráva pro tebe", body:"jestli je dnešek na nic, tak jen dýchejte. jste moje sluníčka a zvládnete to."},
    { dayNumber:6, title:"Zpráva pro tebe", body:"doufám že dneska najdete aspoň jednu věc která vám udělá radost."},
    { dayNumber:7, title:"Zpráva pro tebe", body:"jen malá dávka lásky na dálku :) "},
    { dayNumber:8, title:"Zpráva pro tebe", body:"mimochodem jste gejíčkové."},
    { dayNumber:9, title:"Zpráva pro tebe", body:"kdyby dnešek byl na kundu tak připomínám že jste vy jste taky."},
    { dayNumber:10, title:"Zpráva pro tebe", body:"jen jsem vám chtěla říct že vás mám ráda."},
    
    { dayNumber:11, title:"Zpráva pro tebe", body:"jak se dneska cítíš? :) "},
    { dayNumber:12, title:"Zpráva pro tebe", body:"pokud dneska nic nevyjde tak je to ok, protože včera to taky nebylo zas tak dobrý a furt si tu."},
    { dayNumber:13, title:"Zpráva pro tebe", body:"svět je s vámi trochu hezčí."},
    { dayNumber:14, title:"Zpráva pro tebe", body:"doufám že dnešek bude něžný"},
    { dayNumber:15, title:"Zpráva pro tebe", body:"mám vás ráda a to je dneska celé poselství."},
    { dayNumber:16, title:"Zpráva pro tebe", body:"napiš mi pls"},
    { dayNumber:17, title:"Zpráva pro tebe", body:"ahoj ahoj :) "},
    { dayNumber:18, title:"Zpráva pro tebe", body:"jen připomínám že jste skvělí i když se tak dnes necítíte."},
    { dayNumber:19, title:"Zpráva pro tebe", body:"podívej se na oblohu - tak vás vidím."},
    { dayNumber:20, title:"Zpráva pro tebe", body:"doufám že dnešek přinese něco milého."},

    { dayNumber:21, title:"Zpráva pro tebe", body:"jste čuráci oba dva"},
    { dayNumber:22, title:"Zpráva pro tebe", body:"jak se dneska cítíš? :) "},
    { dayNumber:23, title:"Zpráva pro tebe", body:"špagety s mákem zamíchaný ptákem"},
    { dayNumber:24, title:"Zpráva pro tebe", body:"jen jsem chtěla říct že na vás myslím."},
    { dayNumber:25, title:"Zpráva pro tebe", body:"doufám že jste dnes na sebe hodní."},
    { dayNumber:26, title:"Zpráva pro tebe", body:"malá pozitivní zpráva dne: existujete ;) ."},
    { dayNumber:27, title:"Zpráva pro tebe", body:"naser si ivane. ahoj dianko :) "},
    { dayNumber:28, title:"Zpráva pro tebe", body:" jak tě tahle zpráva našla?"},
    { dayNumber:29, title:"Zpráva pro tebe", body:"posílám srdíčka :) ."},
    { dayNumber:30, title:"Zpráva pro tebe", body:"NAPIŠ MI."},
    { dayNumber:31, title:"Zpráva pro tebe", body:"jak se máte, co děláte a tak??"},
    { dayNumber:32, title:"Zpráva pro tebe", body:"doufám že dneska bude aspoň trochu hezky."},
    { dayNumber:33, title:"Zpráva pro tebe", body:"pamatujete na Budapešť? "},
    { dayNumber:34, title:"Zpráva pro tebe", body:"mám vás ráda. to je celé."},
    { dayNumber:35, title:"Zpráva pro tebe", body:"proč je moje kunda tak úzká????"},
    { dayNumber:36, title:"Zpráva pro tebe", body:"prohřáli jste dneska už pánev?"},
    { dayNumber:37, title:"Zpráva pro tebe", body:"doufám že dnes najdete něco co vás potěší."},
    { dayNumber:38, title:"Zpráva pro tebe", body:"proč je ve slově IVAN a PÍČA stejný počet slov a ve slově DIANA je stejný počet slov jako KOKOT???? "},
    { dayNumber:39, title:"Zpráva pro tebe", body:"jste moje sluníčka."},
    { dayNumber:40, title:"Zpráva pro tebe", body:"dianko vážíme si tě :) "},
    { dayNumber:41, title:"Zpráva pro tebe", body:"mám vás ráda a myslím na vás."},
    { dayNumber:42, title:"Zpráva pro tebe", body:"jsem ráda že vás mám."},
    { dayNumber:43, title:"Zpráva pro tebe", body:"doufám že dnešek nebude moc stresující a když jo tak buďte na sebe hodní."},
    { dayNumber:44, title:"Zpráva pro tebe", body:"kdyby dneska bylo všeho moc tak jen dýchejte, ono to nějak přejde."},
    { dayNumber:45, title:"Zpráva pro tebe", body:"vážíme si jeden druhého :) "},
    { dayNumber:46, title:"Zpráva pro tebe", body:"jen připomínám že vás mám ráda a že jste moje sluníčka."},
    { dayNumber:47, title:"Zpráva pro tebe", body:"mekáček kdy??? "},
    { dayNumber:48, title:"Zpráva pro tebe", body:"zvládáš to líp než si myslíš :) ."},
    { dayNumber:49, title:"Zpráva pro tebe", body:"jsem na tebe pyšná :) "},
    { dayNumber:50, title:"Zpráva pro tebe", body:"If I don't have you with me, I'm alone. You know I never know which way to go I think I need you with me for all-time When I need new direction for my mind"},
    { dayNumber:51, title:"Zpráva pro tebe", body:"mám vás ráda."},
    { dayNumber:52, title:"Zpráva pro tebe", body:"stýská se mi po vás."},
    { dayNumber:53, title:"Zpráva pro tebe", body:"pizza bez lepku v Budapešti???"},
    { dayNumber:54, title:"Zpráva pro tebe", body:"doufám že dneska přijde aspoň jedna malá hezká věc."},
    { dayNumber:55, title:"Zpráva pro tebe", body:"pamatujete, jak si dala Dia jako snack kukuřici v Budapešti?"},
    { dayNumber:56, title:"Zpráva pro tebe", body:"gejíčku"},
    { dayNumber:57, title:"Zpráva pro tebe", body:"vážím si tě."},
    { dayNumber:58, title:"Zpráva pro tebe", body:"pamatuješ jak jsme u mě spali poprvé v budějovicích a podepsali jsme si tu láhev?"},
    { dayNumber:59, title:"Zpráva pro tebe", body:"můj život děláš světlejší (to je pro diu, ivan je černej)"},
    { dayNumber:60, title:"Zpráva pro tebe", body:"co máš dneska za fit bro? pošli mi fotku"},
    { dayNumber:61, title:"Zpráva pro tebe", body:"občas si funny"},
    { dayNumber:62, title:"Zpráva pro tebe", body:"I just know that you know that sorry 🎶"},
    { dayNumber:63, title:"Zpráva pro tebe", body:"doufám že dneska bude lehký den nebo aspoň lehčí než včera."},
    { dayNumber:64, title:"Zpráva pro tebe", body:"kolik máš dneska screentime babe?"},
    { dayNumber:65, title:"Zpráva pro tebe", body:"DO PÍČE JÁ UŽ TAK NEVÍM CO MÁM PSÁT BERTE TOHLE JAKO EASTEREGG"},
    { dayNumber:66, title:"Zpráva pro tebe", body:"už jste dneska goonili?"},
    { dayNumber:67, title:"Zpráva pro tebe", body:"fakt si myslím že v sobě máte víc světla než si uvědomujete."},
    { dayNumber:68, title:"Zpráva pro tebe", body:"Za co jste dnes vděční?"},
    { dayNumber:69, title:"Zpráva pro tebe", body:"hope can be quiet"},
    { dayNumber:70, title:"Zpráva pro tebe", body:"small light is still light"},
    {dayNumber:71, title:"Zpráva pro tebe", body:"jen malý vzkaz na dnešek: buďte na sebe jemní."},
    { dayNumber:72, title:"Zpráva pro tebe", body:"doufám že jste ok a jestli ne tak aspoň trochu spočiňte."},
    { dayNumber:73, title:"Zpráva pro tebe", body:"dýchej bro"},
    { dayNumber:74, title:"Zpráva pro tebe", body:"kdy spolu půjdeme na pennyboardy?"},
    { dayNumber:75, title:"Zpráva pro tebe", body:"pamatujete, jak jsme u nás v Písku vždycky spinkali a chillovali?"},
    { dayNumber:76, title:"Zpráva pro tebe", body:"pamatujete, jak jsme leavnuli akci u Dominika na chatě a šli na pennyboady?"},
    { dayNumber:77, title:"Zpráva pro tebe", body:"pamatujete jak Dia řekla o Ivanovi že je kokot kvůli jeho kostýmu Naruto?"},
    { dayNumber:78, title:"Zpráva pro tebe", body:"pamatuješ, jak jsme v Budapešti šli na tu loď poslední den?"},
    { dayNumber:79, title:"Zpráva pro tebe", body:"pamatuješ jak jsme v Budapešti poslední den ušli tak milion kroků?"},
    { dayNumber:80, title:"Zpráva pro tebe", body:"si v mým srdíčku"},
    { dayNumber:81, title:"Zpráva pro tebe", body:"myslím na tebe"},
    { dayNumber:82, title:"Zpráva pro tebe", body:"Bůh řekl: 'Co můžeš proscrollovat dnes, nenechávej na zítra'"},
    { dayNumber:83, title:"Zpráva pro tebe", body:"pamatujete jak jsme se scházeli v travel cafe?"},
    { dayNumber:84, title:"Zpráva pro tebe", body:"pamatuješ na to jak jsme spolu jeli do Prahy a spali u Ivana?"},
    { dayNumber:85, title:"Zpráva pro tebe", body:"máme mašličku :) "},
    { dayNumber:86, title:"Zpráva pro tebe", body:"you’re stronger than your worst day.",},
    { dayNumber:87, title:"Zpráva pro tebe", body:"you are loved."},
    { dayNumber:88, title:"Zpráva pro tebe", body:"seš dneska líná tlustá kunda? "},
    { dayNumber:89, title:"Zpráva pro tebe", body:"this moment matters.",},
    { dayNumber:90, title:"Zpráva pro tebe", body:"mám vás ráda :) "},
    { dayNumber:91, title:"Zpráva pro tebe", body:"jen malé připomenutí že jste moje sluníčka."},
    { dayNumber:92, title:"Zpráva pro tebe", body:"you’re not behind in life.",},
    { dayNumber:93, title:"Zpráva pro tebe", body:"a jsem ráda že vás mám v životě."},
    { dayNumber:94, title:"Zpráva pro tebe", body:"good things take quiet time.",},
    { dayNumber:95, title:"Zpráva pro tebe", body:"ještě že se máme že jo :) "},
    { dayNumber:96, title:"Zpráva pro tebe", body:"67"},
    { dayNumber:97, title:"Zpráva pro tebe", body:"jste sluníčka a někdo vám to musí pravidelně připomínat."},
    { dayNumber:98, title:"Zpráva pro tebe", body:"jste fakt skvělí lidi a mám vás ráda."},
    { dayNumber:99, title:"Zpráva pro tebe", body:"the world is softer with you in it.",},
    { dayNumber:100, title:"Zpráva pro tebe", body:"small reminder: you’re doing better than you think."}
];

async function seedMessages() {
    const batch = db.batch();
    const collectionRef = db.collection('messages');

    for (const message of messages) {
        const docRef = collectionRef.doc(String(message.dayNumber));
        batch.set(docRef, message);
    }

    await batch.commit();
    console.log(`Hotovo. Nahráno ${messages.length} dokumentů do kolekce "messages".`);
}

seedMessages().catch((error) => {
    console.error('Chyba při seedování:', error);
    process.exit(1);
    });