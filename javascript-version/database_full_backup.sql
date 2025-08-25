PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT NOT NULL,
    "contactName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "website" TEXT,
    "source" TEXT NOT NULL DEFAULT 'MANUAL',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO Customer VALUES('cmemu4m770000i2dwwmonj8q4','asdasdasdasdasdasd',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'MANUAL','ACTIVE',NULL,1755867422563,1755867422563);
INSERT INTO Customer VALUES('cmemu6xw90002i2dwly7ix6ik','yak087775@gmail.com','kral YA','yak087775@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755867531034,1755867531034);
INSERT INTO Customer VALUES('cmemu6y0v0003i2dwavkxmunw','yurdakulibrahim65@gmail.com','İbrahim Yurdakul','yurdakulibrahim65@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755867531200,1755867531200);
INSERT INTO Customer VALUES('cmemu6y4c0004i2dwnufd3hxo','yg175571@gmail.com','yağmur gökçegöz','yg175571@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755867531324,1755867531324);
INSERT INTO Customer VALUES('cmemu6y7y0005i2dwn2jyzc3e','akcinufuk@gmail.com','Ufuk Akçın','akcinufuk@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755867531454,1755867531454);
INSERT INTO Customer VALUES('cmemu6yc20006i2dwuh90ma5e','keklikciridvan@gmail.com','Ridvan Keklikci','keklikciridvan@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755867531602,1755867531602);
INSERT INTO Customer VALUES('cmemu6yfk0007i2dw8kv90nku','suleymanu07@gmail.com','Süleyman Üçpınar','suleymanu07@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755867531728,1755867531728);
INSERT INTO Customer VALUES('cmemu6yix0008i2dwez5irp6y','dgn.cihangir@gmail.com','Cihangir Doğan','dgn.cihangir@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755867531849,1755867531849);
INSERT INTO Customer VALUES('cmemu6ymt0009i2dwwabrx4ek','tseckin.35@gmail.com','T SEÇKİN','tseckin.35@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755867531990,1755867531990);
INSERT INTO Customer VALUES('cmemu6yqd000ai2dwv2fgzlou','tseckin.002@gmail.com','T SECKİN','tseckin.002@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755867532117,1755867532117);
INSERT INTO Customer VALUES('cmemu6ytz000bi2dwkz9g8s6c','emelktyy@gmail.com','Emel Kutay','emelktyy@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755867532247,1755867532247);
INSERT INTO Customer VALUES('cmemu75sc000ci2dwqxj7hpps','denizcanilgin@gmail.com','Deniz Can Ilgın','denizcanilgin@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755867541261,1755867541261);
INSERT INTO Customer VALUES('cmemu75wv000di2dwt52jnrzq','meyer.cloninger3h98@goservicewrap.com','Meyer Cloninger','meyer.cloninger3h98@goservicewrap.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755867541424,1755867541424);
INSERT INTO Customer VALUES('cmemu7605000ei2dwtu7pn3ut','seda.mercan@cerilas.com',NULL,'seda.mercan@cerilas.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755867541542,1755867541542);
INSERT INTO Customer VALUES('cmemu763k000fi2dwfh8qb13y','enesertemm@gmail.com','Enes Ertem','enesertemm@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755867541665,1755888068624);
INSERT INTO Customer VALUES('cmemu767l000gi2dwtnixohfl','alpkulekci@gmail.com','alp kulekci','alpkulekci@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755867541809,1755867541809);
INSERT INTO Customer VALUES('cmemu76az000hi2dwxtdq46hv','citircerez76@gmail.com','nazif kaffar','citircerez76@gmail.com','05373677797',NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755867541931,1755867541931);
INSERT INTO Customer VALUES('cmemu76ek000ii2dw184spizq','hamzacoskun575@gmail.com','Hamza Coşkun','hamzacoskun575@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755867542061,1755867542061);
INSERT INTO Customer VALUES('cmemu76i8000ji2dwcw034yql','goksoykagan@gmail.com','Kağan Göksoy','goksoykagan@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755867542192,1755867542192);
INSERT INTO Customer VALUES('cmemu76lw000ki2dwg1sw1in3','nurhankazan2016@gmail.com','Osman Selim Kazan','nurhankazan2016@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755867542324,1755867542324);
INSERT INTO Customer VALUES('cmemu76pq000li2dwxu6w0l0m','mehmet.cellikkran@gmail.com','mehmet çelikkıran','mehmet.cellikkran@gmail.com','05339863692',NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755867542462,1755867724781);
INSERT INTO Customer VALUES('cmen6gn200002uygiz16ds6qq','RoboGaraj',NULL,NULL,'0532 687 27 93','Pancarlı, 27060 Şehitkamil/Gaziantep, Türkiye','Gaziantep','Türkiye',NULL,'GMAPS','PROSPECT',NULL,1755888138937,1755888138937);
INSERT INTO Customer VALUES('cmen6gn5b0003uygizdgdf603','bayCode Robotik Atölye',NULL,NULL,'(0342) 343 98 27','Gülyuva apartmanı, Pancarlı, Yunus Emre Cd. No:1 altı, 27060 Şehitkamil/Gaziantep, Türkiye','Gaziantep','Türkiye',NULL,'GMAPS','PROSPECT',NULL,1755888139055,1755888139055);
INSERT INTO Customer VALUES('cmen6gn8r0004uygi1n5pj3vu','Robothink Robotik ve Kodlama Merkezi',NULL,NULL,'(0342) 360 20 76','15 Temmuz, 27560 Şehitkamil/Gaziantep, Türkiye','Gaziantep','Türkiye',NULL,'GMAPS','PROSPECT',NULL,1755888139179,1755888139179);
INSERT INTO Customer VALUES('cmen6gnc40005uygifz4ior9v','Selahaddin Eyyubi Eğitim ve Robotik Kodlama Salonu',NULL,NULL,NULL,'Eyüpsultan, 21010. Sk. 2-4, 27590 Şehitkamil/Gaziantep, Türkiye','Gaziantep','Türkiye',NULL,'GMAPS','PROSPECT',NULL,1755888139300,1755888139300);
INSERT INTO Customer VALUES('cmen6gnfq0006uygir9uvrbzx','ROBOKOD',NULL,NULL,'(0342) 341 29 29','Batıkent, 1002. Cd. No:33, 27560 Şehitkamil/Gaziantep, Türkiye','Gaziantep','Türkiye',NULL,'GMAPS','PROSPECT',NULL,1755888139431,1755888139431);
INSERT INTO Customer VALUES('cmen6gnjc0007uyginkr918h9','Evatek Teknoloji Mühendislik',NULL,NULL,'0505 045 10 00','Mücahitler Mahallesi Ş.Ertuğrul Polat Cad, Mücahitler, 52012. Cd. No: 4 D:E, 27090 Şehitkamil/Gaziantep, Türkiye','Gaziantep','Türkiye',NULL,'GMAPS','PROSPECT',NULL,1755888139560,1755888139560);
INSERT INTO Customer VALUES('cmen6h1ap0008uygivhq9hfsw','sucuk31game@gmail.com','vhxs ömzd','sucuk31game@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888157393,1755888157393);
INSERT INTO Customer VALUES('cmen6h1fd0009uygifvw3f2ox','yalcindeniz@gmail.com',NULL,'yalcindeniz@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888157562,1755888157562);
INSERT INTO Customer VALUES('cmen6h1j7000auygi54d32j2r','omermuratcelikel@gmail.com','ömer murat çelikel','omermuratcelikel@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888157700,1755888157700);
INSERT INTO Customer VALUES('cmen6h1ms000buygiu2ouk29q','murat2350@hotmail.com',NULL,'murat2350@hotmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888157828,1755888157828);
INSERT INTO Customer VALUES('cmen6h1qn000cuygiqftsrz94','artbytimdesignstudio@gmail.com','artbytim designstudio','artbytimdesignstudio@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888157967,1755888157967);
INSERT INTO Customer VALUES('cmen6h2vc000duygivgl0hn3b','cihangiirfidan@gmail.com','Cihangir Fidan','cihangiirfidan@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888159433,1755888159433);
INSERT INTO Customer VALUES('cmen6h2zd000euygiueks82io','baris.oz8@gmail.com','Barış Öz','baris.oz8@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888159578,1755888159578);
INSERT INTO Customer VALUES('cmen6h330000fuygiu8ub99l8','korkmazcihan52@gmail.com','Cihan Korkmaz','korkmazcihan52@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888159708,1755888159708);
INSERT INTO Customer VALUES('cmen6h36r000guygi4f2k4bwf','firibo@outlook.com',NULL,'firibo@outlook.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888159844,1755888159844);
INSERT INTO Customer VALUES('cmen6h3aq000huygiqnp9sng7','avsar29@icloud.com','Avşar Zengin','avsar29@icloud.com','05449517414',NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888159987,1755888159987);
INSERT INTO Customer VALUES('cmen6h3eg000iuygi38bx2k3a','alpeerr0303@gmail.com','Alper Alper','alpeerr0303@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888160120,1755888160120);
INSERT INTO Customer VALUES('cmen6h3i6000juygi2pqee33k','abdullahb.kaymak69@gmail.com','Abdullah Berke Kaymak','abdullahb.kaymak69@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888160255,1755888160255);
INSERT INTO Customer VALUES('cmen6h3mx000kuygimlsfa8nt','avececetinkaya@gmail.com','ece çetinkaya','avececetinkaya@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888160426,1755888160426);
INSERT INTO Customer VALUES('cmen6h3q4000luygiosbi3hyq','celikeldeniz194@gmail.com','Deniz Çelikel','celikeldeniz194@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888160540,1755888160540);
INSERT INTO Customer VALUES('cmen6h3u2000muygijigdkr32','mtzengin29@gmail.com','Mehmet','mtzengin29@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888160683,1755888160683);
INSERT INTO Customer VALUES('cmen6h3xr000nuygiuji9g997','jhonflagan@gmail.com','jhon flagan','jhonflagan@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888160815,1755888160815);
INSERT INTO Customer VALUES('cmen6h41s000ouygiyqghkxgr','mageerauld+rzjyn@gmail.com',NULL,'mageerauld+rzjyn@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888160961,1755888160961);
INSERT INTO Customer VALUES('cmen6h459000puygiant95tpd','avze29@gmail.com','Avze Avze','avze29@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888161086,1755888161086);
INSERT INTO Customer VALUES('cmen6h49g000quygiixzaj7oo','mcelikel375@gmail.com','Murat Çelikel','mcelikel375@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888161237,1755888161237);
INSERT INTO Customer VALUES('cmen6h4cz000ruygi5zruw8el','oufukerdem@gmail.com','Ufuk Erdem Özzengin','oufukerdem@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888161364,1755888161364);
INSERT INTO Customer VALUES('cmen6h4gp000suygibo4itb0l','celikelo619@gmail.com','Omer Celikel','celikelo619@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888161497,1755888161497);
INSERT INTO Customer VALUES('cmen6h4kj000tuygi0jnqgx33','ggokcegoz@gmail.com','Gulay GÖKÇEGÖZ','ggokcegoz@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888161635,1755888161635);
INSERT INTO Customer VALUES('cmen6h4oa000uuygibf4e5vb7','aymakk2826@gmail.com','ismail Aymak','aymakk2826@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888161770,1755888161770);
INSERT INTO Customer VALUES('cmen6h4s0000vuygihshgeblv','firezfirdevs8@gmail.com','Firdevs Firez','firezfirdevs8@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888161905,1755888161905);
INSERT INTO Customer VALUES('cmen6h4vw000wuygiyytnxhcz','berkaliozer571@gmail.com','LOSER','berkaliozer571@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888162045,1755888162045);
INSERT INTO Customer VALUES('cmen6h4zm000xuyginqoi7dh2','selcukdeniz@gmail.com','Selcuk Deniz','selcukdeniz@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888162178,1755888162178);
INSERT INTO Customer VALUES('cmen6h53b000yuygijmdwg6wq','zmdaban@gmail.com',NULL,'zmdaban@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888162311,1755888162311);
INSERT INTO Customer VALUES('cmen6h579000zuygi1167ytsj','gizemhalukrgz@hotmail.com','Haluk Karagöz','gizemhalukrgz@hotmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888162454,1755888162454);
INSERT INTO Customer VALUES('cmen6h5ay0010uygi5tptucmv','haticedenizz@hotmail.com',NULL,'haticedenizz@hotmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888162587,1755888162587);
INSERT INTO Customer VALUES('cmen6h5et0011uygiw4bps6u1','elmash501@gmail.com','Hamza Elmas','elmash501@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888162726,1755888162726);
INSERT INTO Customer VALUES('cmen6h5io0012uygigy5otz3z','yalcindeniz3459@gmail.com','Zehra Altaş','yalcindeniz3459@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888162864,1755888162864);
INSERT INTO Customer VALUES('cmen6h5mm0013uygi5nakjxyh','raabia0500@gmail.com','Rabia Avcı','raabia0500@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888163007,1755888163007);
INSERT INTO Customer VALUES('cmen6h5q80014uygi1icxj0vr','raabia050@hotmail.com',NULL,'raabia050@hotmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888163136,1755888163136);
INSERT INTO Customer VALUES('cmen6h5u50015uygi82nl80f6','caliskanekrem85@gmail.com','Ekrem Çalışkan','caliskanekrem85@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888163278,1755888163278);
INSERT INTO Customer VALUES('cmen6h5xr0016uygi59jr0cbb','sevdesencan2004@hotmail.com',NULL,'sevdesencan2004@hotmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888163407,1755888163407);
INSERT INTO Customer VALUES('cmen6h61l0017uygi6krirydm','kisladevrim@gmail.com','Devrim Kışla','kisladevrim@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888163546,1755888163546);
INSERT INTO Customer VALUES('cmen6h65c0018uygi2uxal17c','berkaymete92@gmail.com','Berkaymete','berkaymete92@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888163681,1755888163681);
INSERT INTO Customer VALUES('cmen6h69a0019uygiqn5by5fg','ademtalhakilinc@gmail.com','Adem talha Kılınç','ademtalhakilinc@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888163822,1755888163822);
INSERT INTO Customer VALUES('cmen6h6dd001auygia6zykcb7','hknylmz08@gmail.com','Hakan Yilmaz','hknylmz08@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888163969,1755888163969);
INSERT INTO Customer VALUES('cmen6h6h1001buyginc14d0hc','taha.toktas@hotmail.com','Taha Toktaş','taha.toktas@hotmail.com','05436513801',NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888164102,1755888164102);
INSERT INTO Customer VALUES('cmen6h6km001cuygia9a9oovp','dainasemotorcyle@gmail.com',NULL,'dainasemotorcyle@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888164231,1755888164231);
INSERT INTO Customer VALUES('cmen6h6og001duygi9pw6aga6','dainasemotorcycle@gmail.com','SERKAN SAYLAM','dainasemotorcycle@gmail.com','05412080000',NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888164368,1755888164368);
INSERT INTO Customer VALUES('cmen6h6s6001euygiff6lb4la','mamicelikiz41@gmail.com','Mami','mamicelikiz41@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888164502,1755888164502);
INSERT INTO Customer VALUES('cmen6h6wg001fuygiqey4jdkk','sevtapsoydanunlu@gmail.com','Sevtap Soydan Ünlü','sevtapsoydanunlu@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888164656,1755888164656);
INSERT INTO Customer VALUES('cmen6h6zs001guygi5aa2d024','alkayaeyyub71@gmail.com','Eyüp Alkaya','alkayaeyyub71@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888164776,1755888164776);
INSERT INTO Customer VALUES('cmen6h73l001huygizay016gb','eturhan80@gmail.com','engın turhan','eturhan80@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888164914,1755888164914);
INSERT INTO Customer VALUES('cmen6h779001iuygio152trzx','melekkirktum@gmail.com','Melek TÜM','melekkirktum@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888165046,1755888165046);
INSERT INTO Customer VALUES('cmen6h7b1001juygiu2bip2zk','cetincelep5@gmail.com','Çetin Celep','cetincelep5@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888165182,1755888165182);
INSERT INTO Customer VALUES('cmen6h7f3001kuygiz6yynji7','akiffefeszdgrr@gmail.com','Akif Efe','akiffefeszdgrr@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888165327,1755888165327);
INSERT INTO Customer VALUES('cmen6h7ih001luygifltoaygk','serkansaylam00@gmail.com','Dainese Ss','serkansaylam00@gmail.com',NULL,NULL,NULL,NULL,NULL,'WEBSITE','PROSPECT',NULL,1755888165450,1756084685910);
CREATE TABLE IF NOT EXISTS "CustomerInteraction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT,
    "date" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CustomerInteraction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO CustomerInteraction VALUES('cmemub2tj000ni2dw1ul4nl9t','cmemu76pq000li2dwxu6w0l0m','NOTE','asdasdasda','asdadas',1755867724009,1755867724039);
INSERT INTO CustomerInteraction VALUES('cmemubhld000ri2dwuw7dphh3','cmemu767l000gi2dwtnixohfl','EMAIL','Toplu Email Kampanyası','Kampanya ID: 197098 - Konu: asdas',1755867743184,1755867743185);
INSERT INTO CustomerInteraction VALUES('cmen6f3kn0001uygi3l5w01vd','cmemu763k000fi2dwfh8qb13y','CALL','Arandı ','asdasdsad',1755888066981,1755888067029);
INSERT INTO CustomerInteraction VALUES('cmeqeiwmr0001i2aam4b7w1xj','cmen6h7ih001luygifltoaygk','NOTE','asdasd',NULL,1756083080091,1756083080115);
INSERT INTO CustomerInteraction VALUES('cmeqfhaz40001i27otci28f84','cmen6h7ih001luygifltoaygk','CALL','123123123',NULL,1756084684984,1756084685007);
INSERT INTO CustomerInteraction VALUES('cmeqfivbg0005i27o5tps30le','cmemu75sc000ci2dwqxj7hpps','EMAIL','Toplu Email Kampanyası','Kampanya ID: 668528 - Konu: asdsad',1756084758027,1756084758028);
CREATE TABLE IF NOT EXISTS "CustomerTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "EmailSend" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "customerId" TEXT,
    "toEmail" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isHtml" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "sentAt" DATETIME,
    "firstOpenedAt" DATETIME,
    "lastOpenedAt" DATETIME,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "lastClickedAt" DATETIME,
    "errorMessage" TEXT,
    "trackingId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmailSend_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO EmailSend VALUES('cmemubhl5000pi2dwq9lnm49d','197098','cmemu767l000gi2dwtnixohfl','alpkulekci@gmail.com','asdas','<p>dasdasdsad</p>',1,'sent',1755867743175,NULL,NULL,0,NULL,NULL,'4f1b0afa-d00b-46a3-a277-fcb6313fd03e',1755867743177);
INSERT INTO EmailSend VALUES('cmeqei4690000i2oxzmu83ex3','123456',NULL,'test@example.com','Test Email','Bu bir test emailidir',0,'sent',1756083043225,NULL,NULL,0,NULL,NULL,'test-1756083043225',1756083043233);
INSERT INTO EmailSend VALUES('cmeqepz5l0000i2qo6vjqe6u5','123456',NULL,'test@example.com','Test Email','Bu bir test emailidir',0,'sent',1756083409946,NULL,NULL,0,NULL,NULL,'test-1756083409946',1756083409976);
INSERT INTO EmailSend VALUES('cmeqetmck0000i2kub1x16lhh','123456',NULL,'test@example.com','Test Email','Bu bir test emailidir',0,'sent',1756083579994,NULL,NULL,0,NULL,NULL,'test-1756083579994',1756083580003);
INSERT INTO EmailSend VALUES('cmeqeyjdw0000i22gxe66vly5','123456',NULL,'test@example.com','Test Email','Bu bir test emailidir',0,'sent',1756083809441,NULL,NULL,0,NULL,NULL,'test-1756083809441',1756083809444);
INSERT INTO EmailSend VALUES('cmeqfaz770000i2980gcdwr03','123456',NULL,'test@example.com','Test Email','Bu bir test emailidir',0,'sent',1756084389807,NULL,NULL,0,NULL,NULL,'test-1756084389807',1756084389811);
INSERT INTO EmailSend VALUES('cmeqfivb90003i27oz7guc2j4','668528','cmemu75sc000ci2dwqxj7hpps','denizcanilgin@gmail.com','asdsad','<p>asdasdasd</p>',1,'sent',1756084758019,NULL,NULL,0,NULL,NULL,'2844554b-e9b4-495c-b8c0-ba741e320856',1756084758021);
CREATE TABLE IF NOT EXISTS "EmailTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isHtml" BOOLEAN NOT NULL DEFAULT true,
    "category" TEXT DEFAULT 'general',
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
CREATE TABLE IF NOT EXISTS "TrendyolSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sellerId" TEXT NOT NULL DEFAULT '',
    "apiKey" TEXT NOT NULL DEFAULT '',
    "secretKey" TEXT NOT NULL DEFAULT '',
    "checkInterval" INTEGER NOT NULL DEFAULT 30,
    "openaiApiKey" TEXT NOT NULL DEFAULT '',
    "openaiModel" TEXT NOT NULL DEFAULT 'gpt-4o',
    "openaiMaxTokens" INTEGER NOT NULL DEFAULT 1000,
    "openaiTemperature" REAL NOT NULL DEFAULT 0.7,
    "assistantId" TEXT NOT NULL DEFAULT '',
    "answerTemplate" TEXT NOT NULL DEFAULT '{answer}',
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO TrendyolSettings VALUES('cmemu4oas0001i2dw21geobhx','913474','ucm3MtoH9cMfPk5HLNJI','7XLzfa0QRZ2PgAixqFRo',30,'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','gpt-4o',750,0.7556000000000000493,'asst_8upBTuspnk1s7hBStFChlGFr','{answer} ',1,1755867425284,1755875103010);
CREATE TABLE IF NOT EXISTS "_CustomerToCustomerTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CustomerToCustomerTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CustomerToCustomerTag_B_fkey" FOREIGN KEY ("B") REFERENCES "CustomerTag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "BotActivity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "questionId" TEXT,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO BotActivity VALUES('cmemv8l040000i2z0hu0i0tq8','waiting','Bot 30 saniye aralıklarla çalışmaya başladı',NULL,1,1755869287253);
INSERT INTO BotActivity VALUES('cmemv8l060001i2z07gqa266b','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869287254);
INSERT INTO BotActivity VALUES('cmemv8l3h0002i2z0uglzgh19','no_questions','Yeni soru bulunamadı',NULL,1,1755869287373);
INSERT INTO BotActivity VALUES('cmemv8mo10003i2z04nm8rdch','waiting','Sonraki kontrol: 16:28:39',NULL,1,1755869289410);
INSERT INTO BotActivity VALUES('cmemv98920004i2z0z6n7y67g','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869317383);
INSERT INTO BotActivity VALUES('cmemv98db0005i2z0joc1agfs','no_questions','Yeni soru bulunamadı',NULL,1,1755869317536);
INSERT INTO BotActivity VALUES('cmemv99x00006i2z0lm599qwo','waiting','Sonraki kontrol: 16:29:09',NULL,1,1755869319541);
INSERT INTO BotActivity VALUES('cmemv9d0b0007i2z0a58r4yyd','waiting','Bot 10 saniye aralıklarla çalışmaya başladı',NULL,1,1755869323547);
INSERT INTO BotActivity VALUES('cmemv9d0d0008i2z00zj6mwfn','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869323550);
INSERT INTO BotActivity VALUES('cmemv9d3m0009i2z062jlnu3n','no_questions','Yeni soru bulunamadı',NULL,1,1755869323667);
INSERT INTO BotActivity VALUES('cmemv9enf000ai2z01mri8ote','waiting','Sonraki kontrol: 16:28:55',NULL,1,1755869325675);
INSERT INTO BotActivity VALUES('cmemv9ktl000bi2z0nzwz4112','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869333673);
INSERT INTO BotActivity VALUES('cmemv9kyj000ci2z0wrynfsp6','no_questions','Yeni soru bulunamadı',NULL,1,1755869333852);
INSERT INTO BotActivity VALUES('cmemv9mi9000di2z0d0du2huw','waiting','Sonraki kontrol: 16:29:05',NULL,1,1755869335857);
INSERT INTO BotActivity VALUES('cmemv9ska000ei2z0jfbzfpz8','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869343706);
INSERT INTO BotActivity VALUES('cmemv9sr3000fi2z076fvvao9','no_questions','Yeni soru bulunamadı',NULL,1,1755869343951);
INSERT INTO BotActivity VALUES('cmemv9uar000gi2z0lqy6igv3','waiting','Sonraki kontrol: 16:29:15',NULL,1,1755869345955);
INSERT INTO BotActivity VALUES('cmemv9vrh000hi2z0l9u8xcyq','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869347853);
INSERT INTO BotActivity VALUES('cmemv9vxm000ii2z0oia3xz7r','no_questions','Yeni soru bulunamadı',NULL,1,1755869348074);
INSERT INTO BotActivity VALUES('cmemv9xhe000ji2z0bjwqbpai','waiting','Sonraki kontrol: 16:29:40',NULL,1,1755869350082);
INSERT INTO BotActivity VALUES('cmemva09r000ki2z01y2j3kyk','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869353696);
INSERT INTO BotActivity VALUES('cmemva0cj000li2z0wsbqau5m','no_questions','Yeni soru bulunamadı',NULL,1,1755869353795);
INSERT INTO BotActivity VALUES('cmemva1w8000mi2z0k3lb1doj','waiting','Sonraki kontrol: 16:29:25',NULL,1,1755869355801);
INSERT INTO BotActivity VALUES('cmemva7zm000ni2z0ddy81079','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869363699);
INSERT INTO BotActivity VALUES('cmemva833000oi2z05zk4d9rf','no_questions','Yeni soru bulunamadı',NULL,1,1755869363824);
INSERT INTO BotActivity VALUES('cmemva9mr000pi2z0on43keh0','waiting','Sonraki kontrol: 16:29:35',NULL,1,1755869365827);
INSERT INTO BotActivity VALUES('cmemvafpe000qi2z0oibqrlz7','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869373698);
INSERT INTO BotActivity VALUES('cmemvafse000ri2z01ddrh6z8','no_questions','Yeni soru bulunamadı',NULL,1,1755869373806);
INSERT INTO BotActivity VALUES('cmemvahc2000si2z0e30apcmx','waiting','Sonraki kontrol: 16:29:45',NULL,1,1755869375810);
INSERT INTO BotActivity VALUES('cmemvaim9000ti2z00ixuiwej','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869377473);
INSERT INTO BotActivity VALUES('cmemvaiov000ui2z057y4ckdo','no_questions','Yeni soru bulunamadı',NULL,1,1755869377567);
INSERT INTO BotActivity VALUES('cmemvak8l000vi2z00p6gml31','waiting','Sonraki kontrol: 16:30:09',NULL,1,1755869379574);
INSERT INTO BotActivity VALUES('cmemvanf9000wi2z0idpm168g','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869383701);
INSERT INTO BotActivity VALUES('cmemvanhp000xi2z0e4lz6w2t','no_questions','Yeni soru bulunamadı',NULL,1,1755869383790);
INSERT INTO BotActivity VALUES('cmemvap1e000yi2z06gb1nh29','waiting','Sonraki kontrol: 16:29:55',NULL,1,1755869385795);
INSERT INTO BotActivity VALUES('cmemvav56000zi2z0frs844lt','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869393706);
INSERT INTO BotActivity VALUES('cmemvav7y0010i2z08tt0lht6','no_questions','Yeni soru bulunamadı',NULL,1,1755869393806);
INSERT INTO BotActivity VALUES('cmemvawrl0011i2z0mso0edqr','waiting','Sonraki kontrol: 16:30:05',NULL,1,1755869395809);
INSERT INTO BotActivity VALUES('cmemvb2us0012i2z0d7pnuwbo','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869403701);
INSERT INTO BotActivity VALUES('cmemvb2xj0013i2z004edzlph','no_questions','Yeni soru bulunamadı',NULL,1,1755869403800);
INSERT INTO BotActivity VALUES('cmemvb4h60014i2z0ujlkdzoi','waiting','Sonraki kontrol: 16:30:15',NULL,1,1755869405803);
INSERT INTO BotActivity VALUES('cmemvb5ra0015i2z08c6snbqz','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869407462);
INSERT INTO BotActivity VALUES('cmemvb5s80016i2z0m2ojbmpy','no_questions','Yeni soru bulunamadı',NULL,1,1755869407497);
INSERT INTO BotActivity VALUES('cmemvb7bv0017i2z0xzrgj2ie','waiting','Sonraki kontrol: 16:30:39',NULL,1,1755869409500);
INSERT INTO BotActivity VALUES('cmemvbakl0018i2z0jpe07wjz','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869413701);
INSERT INTO BotActivity VALUES('cmemvban80019i2z0wpp9v84q','no_questions','Yeni soru bulunamadı',NULL,1,1755869413796);
INSERT INTO BotActivity VALUES('cmemvbc6w001ai2z07xrdsrpm','waiting','Sonraki kontrol: 16:30:25',NULL,1,1755869415800);
INSERT INTO BotActivity VALUES('cmemvbiag001bi2z0t70uw62j','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869423705);
INSERT INTO BotActivity VALUES('cmemvbied001ci2z0jycgf3vv','no_questions','Yeni soru bulunamadı',NULL,1,1755869423845);
INSERT INTO BotActivity VALUES('cmemvbjy2001di2z0l1r7vsob','waiting','Sonraki kontrol: 16:30:35',NULL,1,1755869425850);
INSERT INTO BotActivity VALUES('cmemvbq09001ei2z0939z8vk4','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869433706);
INSERT INTO BotActivity VALUES('cmemvbq2x001fi2z0bqvznkfi','no_questions','Yeni soru bulunamadı',NULL,1,1755869433802);
INSERT INTO BotActivity VALUES('cmemvbrmm001gi2z01abicfpj','waiting','Sonraki kontrol: 16:30:45',NULL,1,1755869435807);
INSERT INTO BotActivity VALUES('cmemvbswk001hi2z0ltjcv3jg','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869437461);
INSERT INTO BotActivity VALUES('cmemvbsxj001ii2z0p1toa6s6','no_questions','Yeni soru bulunamadı',NULL,1,1755869437495);
INSERT INTO BotActivity VALUES('cmemvbuh6001ji2z0xxkd9zin','waiting','Sonraki kontrol: 16:31:09',NULL,1,1755869439499);
INSERT INTO BotActivity VALUES('cmemvbxq0001ki2z0kpk3qikv','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869443704);
INSERT INTO BotActivity VALUES('cmemvbxt3001li2z0l1pkhj4t','no_questions','Yeni soru bulunamadı',NULL,1,1755869443815);
INSERT INTO BotActivity VALUES('cmemvbzcs001mi2z03vi2v7xl','waiting','Sonraki kontrol: 16:30:55',NULL,1,1755869445821);
INSERT INTO BotActivity VALUES('cmemvc5j7001ni2z08uhk2uah','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869453828);
INSERT INTO BotActivity VALUES('cmemvc5n7001oi2z0ulsztjn3','no_questions','Yeni soru bulunamadı',NULL,1,1755869453972);
INSERT INTO BotActivity VALUES('cmemvc6ie001pi2z0pdglrcdq','waiting','Bot 10 saniye aralıklarla çalışmaya başladı',NULL,1,1755869455095);
INSERT INTO BotActivity VALUES('cmemvc6ig001qi2z0x6out3w5','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869455096);
INSERT INTO BotActivity VALUES('cmemvc6jd001ri2z0hfsxlrn4','no_questions','Yeni soru bulunamadı',NULL,1,1755869455129);
INSERT INTO BotActivity VALUES('cmemvc76w001si2z0l3dznblw','waiting','Sonraki kontrol: 16:31:05',NULL,1,1755869455977);
INSERT INTO BotActivity VALUES('cmemvc832001ti2z0uss4aiz3','waiting','Sonraki kontrol: 16:31:07',NULL,1,1755869457135);
INSERT INTO BotActivity VALUES('cmemvcd8n001ui2z0kvaouoqv','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869463815);
INSERT INTO BotActivity VALUES('cmemvcdbu001vi2z02rsc930i','no_questions','Yeni soru bulunamadı',NULL,1,1755869463930);
INSERT INTO BotActivity VALUES('cmemvce99001wi2z0odyhtfoa','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869465133);
INSERT INTO BotActivity VALUES('cmemvceae001xi2z0a0rgrf3b','no_questions','Yeni soru bulunamadı',NULL,1,1755869465174);
INSERT INTO BotActivity VALUES('cmemvcevj001yi2z0r55sfvns','waiting','Sonraki kontrol: 16:31:15',NULL,1,1755869465935);
INSERT INTO BotActivity VALUES('cmemvcfu1001zi2z0pkvw8rwv','waiting','Sonraki kontrol: 16:31:17',NULL,1,1755869467177);
INSERT INTO BotActivity VALUES('cmemvcg1y0020i2z0ogm77sqh','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869467462);
INSERT INTO BotActivity VALUES('cmemvcg310021i2z092sdt16z','no_questions','Yeni soru bulunamadı',NULL,1,1755869467502);
INSERT INTO BotActivity VALUES('cmemvchmo0022i2z00k7fe7i9','waiting','Sonraki kontrol: 16:31:39',NULL,1,1755869469505);
INSERT INTO BotActivity VALUES('cmemvcl2g0023i2z0mnmwgujs','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869473960);
INSERT INTO BotActivity VALUES('cmemvclak0024i2z00rpxflkw','no_questions','Yeni soru bulunamadı',NULL,1,1755869474253);
INSERT INTO BotActivity VALUES('cmemvclze0025i2z0yrc06du4','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869475146);
INSERT INTO BotActivity VALUES('cmemvcm0m0026i2z0hwecl0ef','no_questions','Yeni soru bulunamadı',NULL,1,1755869475191);
INSERT INTO BotActivity VALUES('cmemvcmui0027i2z0ogsw9738','waiting','Sonraki kontrol: 16:31:26',NULL,1,1755869476267);
INSERT INTO BotActivity VALUES('cmemvcnka0028i2z0awphwu6u','waiting','Sonraki kontrol: 16:31:27',NULL,1,1755869477195);
INSERT INTO BotActivity VALUES('cmemvcsq40029i2z05k6g3r73','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869483884);
INSERT INTO BotActivity VALUES('cmemvct1c002ai2z04h6rd34t','no_questions','Yeni soru bulunamadı',NULL,1,1755869484288);
INSERT INTO BotActivity VALUES('cmemvcu1a002bi2z01ci6dm3m','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869485582);
INSERT INTO BotActivity VALUES('cmemvcu3i002ci2z0m6tmupx2','no_questions','Yeni soru bulunamadı',NULL,1,1755869485662);
INSERT INTO BotActivity VALUES('cmemvcul3002di2z0hmv54rh7','waiting','Sonraki kontrol: 16:31:36',NULL,1,1755869486295);
INSERT INTO BotActivity VALUES('cmemvcvn6002ei2z06sg7gia4','waiting','Sonraki kontrol: 16:31:37',NULL,1,1755869487666);
INSERT INTO BotActivity VALUES('cmemvd0fk002fi2z02zb1dl6h','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869493873);
INSERT INTO BotActivity VALUES('cmemvd0i4002gi2z03pfmyp20','no_questions','Yeni soru bulunamadı',NULL,1,1755869493964);
INSERT INTO BotActivity VALUES('cmemvd1p0002hi2z0on4v5mwx','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869495509);
INSERT INTO BotActivity VALUES('cmemvd1q4002ii2z0hx8bzgpu','no_questions','Yeni soru bulunamadı',NULL,1,1755869495548);
INSERT INTO BotActivity VALUES('cmemvd21s002ji2z0pjuhwyx6','waiting','Sonraki kontrol: 16:31:45',NULL,1,1755869495969);
INSERT INTO BotActivity VALUES('cmemvd37w002ki2z0hajjxcg1','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869497485);
INSERT INTO BotActivity VALUES('cmemvd39t002li2z0tt7577fy','waiting','Sonraki kontrol: 16:31:47',NULL,1,1755869497554);
INSERT INTO BotActivity VALUES('cmemvd3aa002mi2z0fgq3i9xv','no_questions','Yeni soru bulunamadı',NULL,1,1755869497570);
INSERT INTO BotActivity VALUES('cmemvd4ud002ni2z0pats6b08','waiting','Sonraki kontrol: 16:32:09',NULL,1,1755869499590);
INSERT INTO BotActivity VALUES('cmemvd85p002oi2z0layezo99','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869503885);
INSERT INTO BotActivity VALUES('cmemvd8le002pi2z0jxhp9spy','no_questions','Yeni soru bulunamadı',NULL,1,1755869504450);
INSERT INTO BotActivity VALUES('cmemvd9f0002qi2z0o3iy81q3','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869505516);
INSERT INTO BotActivity VALUES('cmemvd9g9002ri2z05e77pv2n','no_questions','Yeni soru bulunamadı',NULL,1,1755869505562);
INSERT INTO BotActivity VALUES('cmemvda5d002si2z0qy2mcpps','waiting','Sonraki kontrol: 16:31:56',NULL,1,1755869506465);
INSERT INTO BotActivity VALUES('cmemvdb07002ti2z0hlepxxx6','waiting','Sonraki kontrol: 16:31:57',NULL,1,1755869507575);
INSERT INTO BotActivity VALUES('cmemvdfv7002ui2z0mdxhds7x','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869513875);
INSERT INTO BotActivity VALUES('cmemvdfy6002vi2z0t01bekes','no_questions','Yeni soru bulunamadı',NULL,1,1755869513982);
INSERT INTO BotActivity VALUES('cmemvdh4i002wi2z0msnhy9wz','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869515506);
INSERT INTO BotActivity VALUES('cmemvdh5m002xi2z0d656wuz7','no_questions','Yeni soru bulunamadı',NULL,1,1755869515546);
INSERT INTO BotActivity VALUES('cmemvdhif002yi2z0u83evor7','waiting','Sonraki kontrol: 16:32:06',NULL,1,1755869516007);
INSERT INTO BotActivity VALUES('cmemvdipb002zi2z0ytt2vnza','waiting','Sonraki kontrol: 16:32:07',NULL,1,1755869517552);
INSERT INTO BotActivity VALUES('cmemvdnl00030i2z0tcyiz9ml','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869523876);
INSERT INTO BotActivity VALUES('cmemvdno00031i2z04boigv4u','no_questions','Yeni soru bulunamadı',NULL,1,1755869523985);
INSERT INTO BotActivity VALUES('cmemvdoua0032i2z0x1soncac','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869525506);
INSERT INTO BotActivity VALUES('cmemvdovk0033i2z0l93qp3z4','no_questions','Yeni soru bulunamadı',NULL,1,1755869525553);
INSERT INTO BotActivity VALUES('cmemvdp7q0034i2z0diga9fb2','waiting','Sonraki kontrol: 16:32:15',NULL,1,1755869525991);
INSERT INTO BotActivity VALUES('cmemvdqco0035i2z0ruahuaub','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869527464);
INSERT INTO BotActivity VALUES('cmemvdqdn0036i2z0wvi2gxkh','no_questions','Yeni soru bulunamadı',NULL,1,1755869527500);
INSERT INTO BotActivity VALUES('cmemvdqf90037i2z07vr9rg3y','waiting','Sonraki kontrol: 16:32:17',NULL,1,1755869527557);
INSERT INTO BotActivity VALUES('cmemvdrxj0038i2z0w7ogsw8z','waiting','Sonraki kontrol: 16:32:39',NULL,1,1755869529511);
INSERT INTO BotActivity VALUES('cmemvdvas0039i2z0bfk8m8d5','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869533877);
INSERT INTO BotActivity VALUES('cmemvdve4003ai2z0nm2cebqt','no_questions','Yeni soru bulunamadı',NULL,1,1755869533997);
INSERT INTO BotActivity VALUES('cmemvdwl4003bi2z08zqw521s','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869535544);
INSERT INTO BotActivity VALUES('cmemvdwmi003ci2z0vuzdrrmp','no_questions','Yeni soru bulunamadı',NULL,1,1755869535595);
INSERT INTO BotActivity VALUES('cmemvdwxs003di2z0wq9n8vfj','waiting','Sonraki kontrol: 16:32:25',NULL,1,1755869536001);
INSERT INTO BotActivity VALUES('cmemvdy6c003ei2z06cwm46b3','waiting','Sonraki kontrol: 16:32:27',NULL,1,1755869537604);
INSERT INTO BotActivity VALUES('cmemve30j003fi2z0if07fr8b','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869543875);
INSERT INTO BotActivity VALUES('cmemve334003gi2z0yt9i2ioa','no_questions','Yeni soru bulunamadı',NULL,1,1755869543968);
INSERT INTO BotActivity VALUES('cmemve49u003hi2z0tsykd8fd','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869545507);
INSERT INTO BotActivity VALUES('cmemve4au003ii2z0fdfqgkz6','no_questions','Yeni soru bulunamadı',NULL,1,1755869545542);
INSERT INTO BotActivity VALUES('cmemve4mr003ji2z060kv2nwn','waiting','Sonraki kontrol: 16:32:35',NULL,1,1755869545972);
INSERT INTO BotActivity VALUES('cmemve5ui003ki2z0tj9ypn02','waiting','Sonraki kontrol: 16:32:37',NULL,1,1755869547546);
INSERT INTO BotActivity VALUES('cmemveaqa003li2z0i2bkfuvx','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869553875);
INSERT INTO BotActivity VALUES('cmemveatj003mi2z0tftwap9q','no_questions','Yeni soru bulunamadı',NULL,1,1755869553992);
INSERT INTO BotActivity VALUES('cmemvebzo003ni2z0qr6zyg7g','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869555508);
INSERT INTO BotActivity VALUES('cmemvec0r003oi2z0chn4sp4m','no_questions','Yeni soru bulunamadı',NULL,1,1755869555547);
INSERT INTO BotActivity VALUES('cmemvecd7003pi2z08koe12ml','waiting','Sonraki kontrol: 16:32:45',NULL,1,1755869555995);
INSERT INTO BotActivity VALUES('cmemvedi1003qi2z04t7fsyfq','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869557465);
INSERT INTO BotActivity VALUES('cmemvedjm003ri2z005ir1pjz','no_questions','Yeni soru bulunamadı',NULL,1,1755869557522);
INSERT INTO BotActivity VALUES('cmemvedkd003si2z0nma1hqpy','waiting','Sonraki kontrol: 16:32:47',NULL,1,1755869557550);
INSERT INTO BotActivity VALUES('cmemvef39003ti2z0qfc8mmfu','waiting','Sonraki kontrol: 16:33:09',NULL,1,1755869559526);
INSERT INTO BotActivity VALUES('cmemveig5003ui2z01ty09rae','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869563877);
INSERT INTO BotActivity VALUES('cmemveiit003vi2z094b5heks','no_questions','Yeni soru bulunamadı',NULL,1,1755869563973);
INSERT INTO BotActivity VALUES('cmemvejpi003wi2z0retc24i3','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869565510);
INSERT INTO BotActivity VALUES('cmemvejqh003xi2z0ijtots78','no_questions','Yeni soru bulunamadı',NULL,1,1755869565546);
INSERT INTO BotActivity VALUES('cmemvek2h003yi2z0spi6heml','waiting','Sonraki kontrol: 16:32:55',NULL,1,1755869565977);
INSERT INTO BotActivity VALUES('cmemvela5003zi2z0c6ypa7is','waiting','Sonraki kontrol: 16:32:57',NULL,1,1755869567550);
INSERT INTO BotActivity VALUES('cmemveq5v0040i2z0lxml2f3f','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869573876);
INSERT INTO BotActivity VALUES('cmemveq8q0041i2z0kpke28gx','no_questions','Yeni soru bulunamadı',NULL,1,1755869573979);
INSERT INTO BotActivity VALUES('cmemverfa0042i2z0oyant2qk','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869575511);
INSERT INTO BotActivity VALUES('cmemvergj0043i2z0ft9om3yk','no_questions','Yeni soru bulunamadı',NULL,1,1755869575556);
INSERT INTO BotActivity VALUES('cmemverse0044i2z0gjnuz9dc','waiting','Sonraki kontrol: 16:33:05',NULL,1,1755869575982);
INSERT INTO BotActivity VALUES('cmemvet080045i2z0hw4cq4tg','waiting','Sonraki kontrol: 16:33:07',NULL,1,1755869577561);
INSERT INTO BotActivity VALUES('cmemvexvz0046i2z07d568bml','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869583888);
INSERT INTO BotActivity VALUES('cmemvey680047i2z08n0y7894','no_questions','Yeni soru bulunamadı',NULL,1,1755869584257);
INSERT INTO BotActivity VALUES('cmemvez5a0048i2z0efl4wkaz','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869585519);
INSERT INTO BotActivity VALUES('cmemvez6l0049i2z0e94krfrq','no_questions','Yeni soru bulunamadı',NULL,1,1755869585566);
INSERT INTO BotActivity VALUES('cmemvezpx004ai2z0p9cx1h7i','waiting','Sonraki kontrol: 16:33:16',NULL,1,1755869586261);
INSERT INTO BotActivity VALUES('cmemvf0nk004bi2z018vm60sy','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869587472);
INSERT INTO BotActivity VALUES('cmemvf0os004ci2z0evpk0e6u','no_questions','Yeni soru bulunamadı',NULL,1,1755869587516);
INSERT INTO BotActivity VALUES('cmemvf0q9004di2z034rvgpyb','waiting','Sonraki kontrol: 16:33:17',NULL,1,1755869587569);
INSERT INTO BotActivity VALUES('cmemvf28g004ei2z0c41tmqi2','waiting','Sonraki kontrol: 16:33:39',NULL,1,1755869589521);
INSERT INTO BotActivity VALUES('cmemvf5lg004fi2z0vm6d74d7','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869593877);
INSERT INTO BotActivity VALUES('cmemvf5p0004gi2z002928r8r','no_questions','Yeni soru bulunamadı',NULL,1,1755869594005);
INSERT INTO BotActivity VALUES('cmemvf6uy004hi2z0g8vsfl0b','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869595515);
INSERT INTO BotActivity VALUES('cmemvf6w1004ii2z0r0vg37f0','no_questions','Yeni soru bulunamadı',NULL,1,1755869595554);
INSERT INTO BotActivity VALUES('cmemvf78n004ji2z073io4u8m','waiting','Sonraki kontrol: 16:33:26',NULL,1,1755869596008);
INSERT INTO BotActivity VALUES('cmemvf8fy004ki2z07uqu3476','waiting','Sonraki kontrol: 16:33:27',NULL,1,1755869597566);
INSERT INTO BotActivity VALUES('cmemvfdbe004li2z0qp0nvajy','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869603883);
INSERT INTO BotActivity VALUES('cmemvfdg4004mi2z07iznfb09','no_questions','Yeni soru bulunamadı',NULL,1,1755869604053);
INSERT INTO BotActivity VALUES('cmemvfekq004ni2z09pxkx2np','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869605515);
INSERT INTO BotActivity VALUES('cmemvfelw004oi2z0y0skkzwn','no_questions','Yeni soru bulunamadı',NULL,1,1755869605557);
INSERT INTO BotActivity VALUES('cmemvfezu004pi2z06bkh61aj','waiting','Sonraki kontrol: 16:33:36',NULL,1,1755869606059);
INSERT INTO BotActivity VALUES('cmemvfg5l004qi2z0zlhjh933','waiting','Sonraki kontrol: 16:33:37',NULL,1,1755869607562);
INSERT INTO BotActivity VALUES('cmemvfl2v004ri2z0a53fw2jo','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869613943);
INSERT INTO BotActivity VALUES('cmemvfl68004si2z01pw83s88','no_questions','Yeni soru bulunamadı',NULL,1,1755869614064);
INSERT INTO BotActivity VALUES('cmemvfmaq004ti2z0kbpbqhvt','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869615523);
INSERT INTO BotActivity VALUES('cmemvfmbv004ui2z0gl6upqip','no_questions','Yeni soru bulunamadı',NULL,1,1755869615564);
INSERT INTO BotActivity VALUES('cmemvfmpv004vi2z01nx054b0','waiting','Sonraki kontrol: 16:33:46',NULL,1,1755869616068);
INSERT INTO BotActivity VALUES('cmemvfnsp004wi2z0mk5kllk0','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869617465);
INSERT INTO BotActivity VALUES('cmemvfntu004xi2z0hnl7bmmf','no_questions','Yeni soru bulunamadı',NULL,1,1755869617506);
INSERT INTO BotActivity VALUES('cmemvfnvl004yi2z0yl857bwx','waiting','Sonraki kontrol: 16:33:47',NULL,1,1755869617569);
INSERT INTO BotActivity VALUES('cmemvfpdk004zi2z0eqjz7ygl','waiting','Sonraki kontrol: 16:34:09',NULL,1,1755869619512);
INSERT INTO BotActivity VALUES('cmemvfsrf0050i2z05aadswmu','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869623899);
INSERT INTO BotActivity VALUES('cmemvfsu70051i2z027712ty2','no_questions','Yeni soru bulunamadı',NULL,1,1755869623999);
INSERT INTO BotActivity VALUES('cmemvfu0c0052i2z0jhffd264','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869625516);
INSERT INTO BotActivity VALUES('cmemvfu1b0053i2z0fdkohrf4','no_questions','Yeni soru bulunamadı',NULL,1,1755869625552);
INSERT INTO BotActivity VALUES('cmemvfudx0054i2z023fgct3t','waiting','Sonraki kontrol: 16:33:56',NULL,1,1755869626005);
INSERT INTO BotActivity VALUES('cmemvfvl60055i2z06n1jfk7l','waiting','Sonraki kontrol: 16:33:57',NULL,1,1755869627563);
INSERT INTO BotActivity VALUES('cmemvg0h60056i2z09pqzkl92','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869633899);
INSERT INTO BotActivity VALUES('cmemvg0pu0057i2z02ecp95uq','no_questions','Yeni soru bulunamadı',NULL,1,1755869634210);
INSERT INTO BotActivity VALUES('cmemvg1q50058i2z0xbaxpdcl','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869635517);
INSERT INTO BotActivity VALUES('cmemvg1r40059i2z0amrin12h','no_questions','Yeni soru bulunamadı',NULL,1,1755869635552);
INSERT INTO BotActivity VALUES('cmemvg29j005ai2z0caksbaok','waiting','Sonraki kontrol: 16:34:06',NULL,1,1755869636216);
INSERT INTO BotActivity VALUES('cmemvg3ax005bi2z0svn5zsg6','waiting','Sonraki kontrol: 16:34:07',NULL,1,1755869637560);
INSERT INTO BotActivity VALUES('cmemvg873005ci2z0j37kc01k','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869643904);
INSERT INTO BotActivity VALUES('cmemvg8a3005di2z0wto3o0dx','no_questions','Yeni soru bulunamadı',NULL,1,1755869644011);
INSERT INTO BotActivity VALUES('cmemvg9fy005ei2z043pkeu7k','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869645518);
INSERT INTO BotActivity VALUES('cmemvg9h3005fi2z0qhb5pd2x','no_questions','Yeni soru bulunamadı',NULL,1,1755869645559);
INSERT INTO BotActivity VALUES('cmemvg9tw005gi2z0yzerxc41','waiting','Sonraki kontrol: 16:34:16',NULL,1,1755869646019);
INSERT INTO BotActivity VALUES('cmemvgay2005hi2z02hdo3v28','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869647467);
INSERT INTO BotActivity VALUES('cmemvgaz1005ii2z02dukkwqf','no_questions','Yeni soru bulunamadı',NULL,1,1755869647501);
INSERT INTO BotActivity VALUES('cmemvgb0u005ji2z04auh1itr','waiting','Sonraki kontrol: 16:34:17',NULL,1,1755869647566);
INSERT INTO BotActivity VALUES('cmemvgciu005ki2z0459ksi4h','waiting','Sonraki kontrol: 16:34:39',NULL,1,1755869649510);
INSERT INTO BotActivity VALUES('cmemvgfww005li2z0idajzpbe','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869653905);
INSERT INTO BotActivity VALUES('cmemvgfzu005mi2z0jd8yuevw','no_questions','Yeni soru bulunamadı',NULL,1,1755869654010);
INSERT INTO BotActivity VALUES('cmemvgh5r005ni2z0kflythsx','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869655519);
INSERT INTO BotActivity VALUES('cmemvgh6p005oi2z0ivaku07u','no_questions','Yeni soru bulunamadı',NULL,1,1755869655553);
INSERT INTO BotActivity VALUES('cmemvghjm005pi2z0nbrbaqff','waiting','Sonraki kontrol: 16:34:26',NULL,1,1755869656018);
INSERT INTO BotActivity VALUES('cmemvgiqe005qi2z0q6b58k2k','waiting','Sonraki kontrol: 16:34:27',NULL,1,1755869657558);
INSERT INTO BotActivity VALUES('cmemvgnmn005ri2z08j00ow75','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869663903);
INSERT INTO BotActivity VALUES('cmemvgnub005si2z0t5odopng','no_questions','Yeni soru bulunamadı',NULL,1,1755869664180);
INSERT INTO BotActivity VALUES('cmemvgovm005ti2z0l470byh7','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869665522);
INSERT INTO BotActivity VALUES('cmemvgowl005ui2z0tva6zt69','no_questions','Yeni soru bulunamadı',NULL,1,1755869665557);
INSERT INTO BotActivity VALUES('cmemvgpe4005vi2z0rzgkaw88','waiting','Sonraki kontrol: 16:34:36',NULL,1,1755869666189);
INSERT INTO BotActivity VALUES('cmemvgqg9005wi2z0rq26ro9c','waiting','Sonraki kontrol: 16:34:37',NULL,1,1755869667561);
INSERT INTO BotActivity VALUES('cmemvgvcf005xi2z00cqlfz7b','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869673903);
INSERT INTO BotActivity VALUES('cmemvgvez005yi2z0grlpwbi4','no_questions','Yeni soru bulunamadı',NULL,1,1755869673995);
INSERT INTO BotActivity VALUES('cmemvgwle005zi2z0lfrxf74s','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869675522);
INSERT INTO BotActivity VALUES('cmemvgwmp0060i2z0r78pp1e1','no_questions','Yeni soru bulunamadı',NULL,1,1755869675569);
INSERT INTO BotActivity VALUES('cmemvgwyy0061i2z0bje1rcnw','waiting','Sonraki kontrol: 16:34:45',NULL,1,1755869676011);
INSERT INTO BotActivity VALUES('cmemvgy3f0062i2z08s959u98','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869677467);
INSERT INTO BotActivity VALUES('cmemvgy4f0063i2z05qr5gpgs','no_questions','Yeni soru bulunamadı',NULL,1,1755869677504);
INSERT INTO BotActivity VALUES('cmemvgy6c0064i2z0egiqlliw','waiting','Sonraki kontrol: 16:34:47',NULL,1,1755869677573);
INSERT INTO BotActivity VALUES('cmemvgzo30065i2z0gzmy7t34','waiting','Sonraki kontrol: 16:35:09',NULL,1,1755869679507);
INSERT INTO BotActivity VALUES('cmemvh32d0066i2z0w0h1k3xb','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869683909);
INSERT INTO BotActivity VALUES('cmemvh35h0067i2z0axhkrv6e','no_questions','Yeni soru bulunamadı',NULL,1,1755869684022);
INSERT INTO BotActivity VALUES('cmemvh4b60068i2z0fvbsv97s','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869685522);
INSERT INTO BotActivity VALUES('cmemvh4cg0069i2z0b1pxkcjp','no_questions','Yeni soru bulunamadı',NULL,1,1755869685568);
INSERT INTO BotActivity VALUES('cmemvh4p9006ai2z06kvl74aw','waiting','Sonraki kontrol: 16:34:56',NULL,1,1755869686030);
INSERT INTO BotActivity VALUES('cmemvh5w7006bi2z03rvv27pc','waiting','Sonraki kontrol: 16:34:57',NULL,1,1755869687576);
INSERT INTO BotActivity VALUES('cmemvhava006ci2z0rk8ugtbd','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869694023);
INSERT INTO BotActivity VALUES('cmemvhb0q006di2z0ciqfybdo','no_questions','Yeni soru bulunamadı',NULL,1,1755869694218);
INSERT INTO BotActivity VALUES('cmemvhc0z006ei2z01vistpna','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869695523);
INSERT INTO BotActivity VALUES('cmemvhc20006fi2z0ozars20j','no_questions','Yeni soru bulunamadı',NULL,1,1755869695560);
INSERT INTO BotActivity VALUES('cmemvhckc006gi2z02ihh77m1','waiting','Sonraki kontrol: 16:35:06',NULL,1,1755869696221);
INSERT INTO BotActivity VALUES('cmemvhdln006hi2z0akv0zb3u','waiting','Sonraki kontrol: 16:35:07',NULL,1,1755869697564);
INSERT INTO BotActivity VALUES('cmemvhij5006ii2z01fzv92ko','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869703953);
INSERT INTO BotActivity VALUES('cmemvhim6006ji2z03ii1yc38','no_questions','Yeni soru bulunamadı',NULL,1,1755869704062);
INSERT INTO BotActivity VALUES('cmemvhjqt006ki2z0zwv1l4xy','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869705526);
INSERT INTO BotActivity VALUES('cmemvhjrz006li2z0gr81hfeg','no_questions','Yeni soru bulunamadı',NULL,1,1755869705567);
INSERT INTO BotActivity VALUES('cmemvhk5u006mi2z03fk2juzs','waiting','Sonraki kontrol: 16:35:16',NULL,1,1755869706067);
INSERT INTO BotActivity VALUES('cmemvhl8r006ni2z0s1fodvwj','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869707468);
INSERT INTO BotActivity VALUES('cmemvhl9t006oi2z0idlmhctx','no_questions','Yeni soru bulunamadı',NULL,1,1755869707506);
INSERT INTO BotActivity VALUES('cmemvhlbm006pi2z0matranpq','waiting','Sonraki kontrol: 16:35:17',NULL,1,1755869707571);
INSERT INTO BotActivity VALUES('cmemvhmti006qi2z0i9uxlwr7','waiting','Sonraki kontrol: 16:35:39',NULL,1,1755869709510);
INSERT INTO BotActivity VALUES('cmemvhq8y006ri2z0s14s6h82','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869713954);
INSERT INTO BotActivity VALUES('cmemvhqfk006si2z06hmox2dm','no_questions','Yeni soru bulunamadı',NULL,1,1755869714193);
INSERT INTO BotActivity VALUES('cmemvhrgm006ti2z0ttdqy3ep','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869715526);
INSERT INTO BotActivity VALUES('cmemvhri3006ui2z07w0z4u0n','no_questions','Yeni soru bulunamadı',NULL,1,1755869715579);
INSERT INTO BotActivity VALUES('cmemvhs0z006vi2z0glosdkvr','waiting','Sonraki kontrol: 16:35:26',NULL,1,1755869716259);
INSERT INTO BotActivity VALUES('cmemvht1s006wi2z024dhtwhv','waiting','Sonraki kontrol: 16:35:27',NULL,1,1755869717584);
INSERT INTO BotActivity VALUES('cmemvhxyr006xi2z0amn9t261','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869723956);
INSERT INTO BotActivity VALUES('cmemvhy1n006yi2z0qz6w6de4','no_questions','Yeni soru bulunamadı',NULL,1,1755869724060);
INSERT INTO BotActivity VALUES('cmemvhz6g006zi2z0hktcmp7o','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869725528);
INSERT INTO BotActivity VALUES('cmemvhz7k0070i2z0vf80ekxw','no_questions','Yeni soru bulunamadı',NULL,1,1755869725569);
INSERT INTO BotActivity VALUES('cmemvhzlb0071i2z0tqk3u6zs','waiting','Sonraki kontrol: 16:35:36',NULL,1,1755869726063);
INSERT INTO BotActivity VALUES('cmemvi0r70072i2z01dmq0ls5','waiting','Sonraki kontrol: 16:35:37',NULL,1,1755869727571);
INSERT INTO BotActivity VALUES('cmemvi5ok0073i2z03q1dbfea','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869733956);
INSERT INTO BotActivity VALUES('cmemvi5r10074i2z0pf7p3u0f','no_questions','Yeni soru bulunamadı',NULL,1,1755869734046);
INSERT INTO BotActivity VALUES('cmemvi6w70075i2z01xu9ysbb','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869735528);
INSERT INTO BotActivity VALUES('cmemvi6x90076i2z0uk2gwl2c','no_questions','Yeni soru bulunamadı',NULL,1,1755869735566);
INSERT INTO BotActivity VALUES('cmemvi7ao0077i2z0th2iz6p1','waiting','Sonraki kontrol: 16:35:46',NULL,1,1755869736049);
INSERT INTO BotActivity VALUES('cmemvi8e60078i2z07le12rm8','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869737470);
INSERT INTO BotActivity VALUES('cmemvi8f50079i2z0ym8lhevc','no_questions','Yeni soru bulunamadı',NULL,1,1755869737505);
INSERT INTO BotActivity VALUES('cmemvi8gv007ai2z0i6qb5ifj','waiting','Sonraki kontrol: 16:35:47',NULL,1,1755869737568);
INSERT INTO BotActivity VALUES('cmemvi9ys007bi2z0wp8412zy','waiting','Sonraki kontrol: 16:36:09',NULL,1,1755869739509);
INSERT INTO BotActivity VALUES('cmemvidee007ci2z0gr7fjhl5','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869743958);
INSERT INTO BotActivity VALUES('cmemvidh5007di2z0l6h4jklb','no_questions','Yeni soru bulunamadı',NULL,1,1755869744058);
INSERT INTO BotActivity VALUES('cmemviem1007ei2z0n0ep1yjo','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869745530);
INSERT INTO BotActivity VALUES('cmemvieni007fi2z01a2bza1v','no_questions','Yeni soru bulunamadı',NULL,1,1755869745582);
INSERT INTO BotActivity VALUES('cmemvif0y007gi2z029vr3w63','waiting','Sonraki kontrol: 16:35:56',NULL,1,1755869746066);
INSERT INTO BotActivity VALUES('cmemvig78007hi2z0gfv0sp4b','waiting','Sonraki kontrol: 16:35:57',NULL,1,1755869747588);
INSERT INTO BotActivity VALUES('cmemvil4e007ii2z0147thz8h','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869753966);
INSERT INTO BotActivity VALUES('cmemvil76007ji2z0bg9am2go','no_questions','Yeni soru bulunamadı',NULL,1,1755869754066);
INSERT INTO BotActivity VALUES('cmemvimbw007ki2z0vdrph0b9','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869755532);
INSERT INTO BotActivity VALUES('cmemvimd9007li2z0veesccvt','no_questions','Yeni soru bulunamadı',NULL,1,1755869755581);
INSERT INTO BotActivity VALUES('cmemvimqw007mi2z0lyqlsayy','waiting','Sonraki kontrol: 16:36:06',NULL,1,1755869756072);
INSERT INTO BotActivity VALUES('cmemvinww007ni2z0g9e8lcq8','waiting','Sonraki kontrol: 16:36:07',NULL,1,1755869757584);
INSERT INTO BotActivity VALUES('cmemvistz007oi2z0z7ev9q8l','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869763960);
INSERT INTO BotActivity VALUES('cmemviswq007pi2z0satpkihg','no_questions','Yeni soru bulunamadı',NULL,1,1755869764058);
INSERT INTO BotActivity VALUES('cmemviu1m007qi2z0cjxuywxu','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869765530);
INSERT INTO BotActivity VALUES('cmemviu2i007ri2z05z1u4yqy','no_questions','Yeni soru bulunamadı',NULL,1,1755869765562);
INSERT INTO BotActivity VALUES('cmemviugf007si2z0f1f2hesf','waiting','Sonraki kontrol: 16:36:16',NULL,1,1755869766064);
INSERT INTO BotActivity VALUES('cmemvivjg007ti2z0p2ga7bv9','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869767469);
INSERT INTO BotActivity VALUES('cmemvivkd007ui2z0tevjriwf','no_questions','Yeni soru bulunamadı',NULL,1,1755869767501);
INSERT INTO BotActivity VALUES('cmemvivm4007vi2z08eyh9mq5','waiting','Sonraki kontrol: 16:36:17',NULL,1,1755869767565);
INSERT INTO BotActivity VALUES('cmemvix41007wi2z0aoc2y851','waiting','Sonraki kontrol: 16:36:39',NULL,1,1755869769505);
INSERT INTO BotActivity VALUES('cmemvj0js007xi2z090woo3cc','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869773960);
INSERT INTO BotActivity VALUES('cmemvj0nc007yi2z0qnp06fes','no_questions','Yeni soru bulunamadı',NULL,1,1755869774088);
INSERT INTO BotActivity VALUES('cmemvj1sb007zi2z05yace3ng','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869775564);
INSERT INTO BotActivity VALUES('cmemvj1tr0080i2z0nvwd5iyc','no_questions','Yeni soru bulunamadı',NULL,1,1755869775616);
INSERT INTO BotActivity VALUES('cmemvj26y0081i2z0t2hov2kq','waiting','Sonraki kontrol: 16:36:26',NULL,1,1755869776091);
INSERT INTO BotActivity VALUES('cmemvj3dm0082i2z0sl2bll6x','waiting','Sonraki kontrol: 16:36:27',NULL,1,1755869777627);
INSERT INTO BotActivity VALUES('cmemvj89y0083i2z0jqbyd0oz','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869783974);
INSERT INTO BotActivity VALUES('cmemvj8e30084i2z0s0ubbz5e','no_questions','Yeni soru bulunamadı',NULL,1,1755869784123);
INSERT INTO BotActivity VALUES('cmemvj9ha0085i2z0gu6uwp83','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869785534);
INSERT INTO BotActivity VALUES('cmemvj9i80086i2z0h2d8m5d1','no_questions','Yeni soru bulunamadı',NULL,1,1755869785568);
INSERT INTO BotActivity VALUES('cmemvj9xx0087i2z05ou4va34','waiting','Sonraki kontrol: 16:36:36',NULL,1,1755869786133);
INSERT INTO BotActivity VALUES('cmemvjb1y0088i2z0jicsfv9l','waiting','Sonraki kontrol: 16:36:37',NULL,1,1755869787575);
INSERT INTO BotActivity VALUES('cmemvjfzh0089i2z0insvr2bd','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869793965);
INSERT INTO BotActivity VALUES('cmemvjg36008ai2z0ywhl4uj5','no_questions','Yeni soru bulunamadı',NULL,1,1755869794098);
INSERT INTO BotActivity VALUES('cmemvjh73008bi2z0gvuw92s2','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869795536);
INSERT INTO BotActivity VALUES('cmemvjh83008ci2z0sqga7m8u','no_questions','Yeni soru bulunamadı',NULL,1,1755869795571);
INSERT INTO BotActivity VALUES('cmemvjhmt008di2z0hm39nd8z','waiting','Sonraki kontrol: 16:36:46',NULL,1,1755869796102);
INSERT INTO BotActivity VALUES('cmemvjios008ei2z07ac4evnt','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869797469);
INSERT INTO BotActivity VALUES('cmemvjipu008fi2z0obaufku2','no_questions','Yeni soru bulunamadı',NULL,1,1755869797506);
INSERT INTO BotActivity VALUES('cmemvjirr008gi2z03ala0sxe','waiting','Sonraki kontrol: 16:36:47',NULL,1,1755869797576);
INSERT INTO BotActivity VALUES('cmemvjk9j008hi2z0jy0jqohy','waiting','Sonraki kontrol: 16:37:09',NULL,1,1755869799511);
INSERT INTO BotActivity VALUES('cmemvjnpf008ii2z0hzg9qlj6','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869803971);
INSERT INTO BotActivity VALUES('cmemvjnsu008ji2z07lhznl51','no_questions','Yeni soru bulunamadı',NULL,1,1755869804095);
INSERT INTO BotActivity VALUES('cmemvjoww008ki2z0w5h9wpp0','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869805536);
INSERT INTO BotActivity VALUES('cmemvjoy3008li2z0vfp49si7','no_questions','Yeni soru bulunamadı',NULL,1,1755869805579);
INSERT INTO BotActivity VALUES('cmemvjpck008mi2z01lzinupg','waiting','Sonraki kontrol: 16:36:56',NULL,1,1755869806101);
INSERT INTO BotActivity VALUES('cmemvjqhr008ni2z0l9hv3xk7','waiting','Sonraki kontrol: 16:36:57',NULL,1,1755869807584);
INSERT INTO BotActivity VALUES('cmemvjqwg008oi2z0zelu8l4i','waiting','Bot 10 saniye aralıklarla çalışmaya başladı',NULL,1,1755869808113);
INSERT INTO BotActivity VALUES('cmemvjqwj008pi2z0j0hr9pbq','checking_questions','Yanıtsız sorular kontrol ediliyor...',NULL,1,1755869808115);
INSERT INTO BotActivity VALUES('cmemvjqwk008qi2z0tg417kll','found_question','Soru bulundu: "Bu ürünün garanti süresi nedir?..."',NULL,1,1755869808116);
INSERT INTO BotActivity VALUES('cmemvjqwn008ri2z0gjv76uxy','getting_ai_response','Yapay zekadan yanıt alınıyor...',NULL,1,1755869808119);
INSERT INTO BotActivity VALUES('cmemvjtg6008si2z0xkmnebnr','ai_response_received','Yapay zeka yanıtı alındı',NULL,1,1755869811415);
INSERT INTO BotActivity VALUES('cmemvjtgc008ti2z09kiqkeuc','sending_answer','Yanıt hazırlandı ve gönderilecek...',NULL,1,1755869811420);
INSERT INTO BotActivity VALUES('cmemvju8c008ui2z04brwf4pd','answer_sent','Yanıt gönderildi! Soru: "Bu ürünün garanti süresi nedir..."',NULL,1,1755869812428);
INSERT INTO BotActivity VALUES('cmemvjvf2008vi2z0uthpndio','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869813966);
INSERT INTO BotActivity VALUES('cmemvjvhz008wi2z0az6lwrlu','no_questions','Yeni soru bulunamadı',NULL,1,1755869814071);
INSERT INTO BotActivity VALUES('cmemvjwjt008xi2z03p3pm0zb','waiting','Sonraki kontrol: 16:37:05',NULL,1,1755869815434);
INSERT INTO BotActivity VALUES('cmemvjwmp008yi2z0f0ysg1ft','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869815538);
INSERT INTO BotActivity VALUES('cmemvjwnr008zi2z069bxu8c7','no_questions','Yeni soru bulunamadı',NULL,1,1755869815576);
INSERT INTO BotActivity VALUES('cmemvjx1q0090i2z0adoygw6k','waiting','Sonraki kontrol: 16:37:06',NULL,1,1755869816078);
INSERT INTO BotActivity VALUES('cmemvjy7i0091i2z0wagdcf1h','waiting','Sonraki kontrol: 16:37:07',NULL,1,1755869817582);
INSERT INTO BotActivity VALUES('cmemvk1yg0092i2z0lj5m9gte','checking_questions','Yanıtsız sorular kontrol ediliyor...',NULL,1,1755869822441);
INSERT INTO BotActivity VALUES('cmemvk1ym0093i2z0te6v5nqj','found_question','Soru bulundu: "Bu ürünün garanti süresi nedir?..."',NULL,1,1755869822446);
INSERT INTO BotActivity VALUES('cmemvk1yv0094i2z0zk9dikk0','getting_ai_response','Yapay zekadan yanıt alınıyor...',NULL,1,1755869822456);
INSERT INTO BotActivity VALUES('cmemvk34w0095i2z094oyvu6m','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869823969);
INSERT INTO BotActivity VALUES('cmemvk37w0096i2z06parktb1','no_questions','Yeni soru bulunamadı',NULL,1,1755869824076);
INSERT INTO BotActivity VALUES('cmemvk4cj0097i2z0tooxstpd','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869825540);
INSERT INTO BotActivity VALUES('cmemvk4dn0098i2z0tw50vvyz','no_questions','Yeni soru bulunamadı',NULL,1,1755869825579);
INSERT INTO BotActivity VALUES('cmemvk4rl0099i2z0z9vsavr1','waiting','Sonraki kontrol: 16:37:16',NULL,1,1755869826081);
INSERT INTO BotActivity VALUES('cmemvk5r0009ai2z0icv6am1f','ai_response_received','Yapay zeka yanıtı alındı',NULL,1,1755869827357);
INSERT INTO BotActivity VALUES('cmemvk5r3009bi2z0xbmjuhgh','sending_answer','Yanıt hazırlandı ve gönderilecek...',NULL,1,1755869827359);
INSERT INTO BotActivity VALUES('cmemvk5u4009ci2z0ezqvke49','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869827468);
INSERT INTO BotActivity VALUES('cmemvk5v5009di2z0fkg8u7y4','no_questions','Yeni soru bulunamadı',NULL,1,1755869827506);
INSERT INTO BotActivity VALUES('cmemvk5xc009ei2z0mqs21ssq','waiting','Sonraki kontrol: 16:37:17',NULL,1,1755869827585);
INSERT INTO BotActivity VALUES('cmemvk6j2009fi2z07tzr0bxi','answer_sent','Yanıt gönderildi! Soru: "Bu ürünün garanti süresi nedir..."',NULL,1,1755869828366);
INSERT INTO BotActivity VALUES('cmemvk7ew009gi2z0hen5f1rb','waiting','Sonraki kontrol: 16:37:39',NULL,1,1755869829513);
INSERT INTO BotActivity VALUES('cmemvk8uk009hi2z0oy71807y','waiting','Sonraki kontrol: 16:37:21',NULL,1,1755869831373);
INSERT INTO BotActivity VALUES('cmemvkxpn009ii2z0dfizzz6v','waiting','Bot 60 saniye aralıklarla çalışmaya başladı',NULL,1,1755869863596);
INSERT INTO BotActivity VALUES('cmemvkxpt009ji2z07oxtkazl','checking_questions','Yanıtsız sorular kontrol ediliyor...',NULL,1,1755869863602);
INSERT INTO BotActivity VALUES('cmemvkxpx009ki2z0illb6vd3','found_question','Soru bulundu: "Bu ürünün garanti süresi nedir?..."',NULL,1,1755869863605);
INSERT INTO BotActivity VALUES('cmemvkxq1009li2z04ynxowbq','getting_ai_response','Yapay zekadan yanıt alınıyor...',NULL,1,1755869863609);
INSERT INTO BotActivity VALUES('cmemvl0ii009mi2z00qju0icc','ai_response_received','Yapay zeka yanıtı alındı',NULL,1,1755869867227);
INSERT INTO BotActivity VALUES('cmemvl0iq009ni2z0ow6qng3f','sending_answer','Yanıt hazırlandı ve gönderilecek...',NULL,1,1755869867234);
INSERT INTO BotActivity VALUES('cmemvl1av009oi2z0i19b07sl','answer_sent','Yanıt gönderildi! Soru: "Bu ürünün garanti süresi nedir..."',NULL,1,1755869868247);
INSERT INTO BotActivity VALUES('cmemvl3mm009pi2z018dje1qb','waiting','Sonraki kontrol: 16:38:51',NULL,1,1755869871262);
INSERT INTO BotActivity VALUES('cmemvlg57009qi2z0twdniqme','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869887484);
INSERT INTO BotActivity VALUES('cmemvlg9z009ri2z0h1rjaurm','no_questions','Yeni soru bulunamadı',NULL,1,1755869887655);
INSERT INTO BotActivity VALUES('cmemvlhtt009si2z07qwdgbjh','waiting','Sonraki kontrol: 16:38:39',NULL,1,1755869889666);
INSERT INTO BotActivity VALUES('cmemvm3af009ti2z054gk5pbi','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869917480);
INSERT INTO BotActivity VALUES('cmemvm3dc009ui2z0e6lzc71b','no_questions','Yeni soru bulunamadı',NULL,1,1755869917584);
INSERT INTO BotActivity VALUES('cmemvm4x4009vi2z0ayfypk55','waiting','Sonraki kontrol: 16:39:09',NULL,1,1755869919592);
INSERT INTO BotActivity VALUES('cmemvmblo009wi2z0tvwfb2i1','checking_questions','Yanıtsız sorular kontrol ediliyor...',NULL,1,1755869928253);
INSERT INTO BotActivity VALUES('cmemvmblr009xi2z0xhewr9sh','found_question','Soru bulundu: "Bu ürünün garanti süresi nedir?..."',NULL,1,1755869928255);
INSERT INTO BotActivity VALUES('cmemvmbls009yi2z0rvkvq8u8','getting_ai_response','Yapay zekadan yanıt alınıyor...',NULL,1,1755869928257);
INSERT INTO BotActivity VALUES('cmemvmejm009zi2z04dm7bjv5','ai_response_received','Yapay zeka yanıtı alındı',NULL,1,1755869932066);
INSERT INTO BotActivity VALUES('cmemvmejt00a0i2z0ygnm38gk','sending_answer','Yanıt hazırlandı ve gönderilecek...',NULL,1,1755869932073);
INSERT INTO BotActivity VALUES('cmemvmfbw00a1i2z0vpf3digp','answer_sent','Yanıt gönderildi! Soru: "Bu ürünün garanti süresi nedir..."',NULL,1,1755869933084);
INSERT INTO BotActivity VALUES('cmemvmhng00a2i2z01i5c373z','waiting','Sonraki kontrol: 16:39:56',NULL,1,1755869936092);
INSERT INTO BotActivity VALUES('cmemvmqfk00a3i2z0ptjk0urb','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869947473);
INSERT INTO BotActivity VALUES('cmemvmqim00a4i2z0clyrno7l','no_questions','Yeni soru bulunamadı',NULL,1,1755869947582);
INSERT INTO BotActivity VALUES('cmemvms2800a5i2z0ia0pjfuv','waiting','Sonraki kontrol: 16:39:39',NULL,1,1755869949585);
INSERT INTO BotActivity VALUES('cmemvndlz00a6i2z057cfsacv','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755869977511);
INSERT INTO BotActivity VALUES('cmemvndrb00a7i2z0mndwc0ue','no_questions','Yeni soru bulunamadı',NULL,1,1755869977703);
INSERT INTO BotActivity VALUES('cmemvnfay00a8i2z00xh8ny9d','waiting','Sonraki kontrol: 16:40:09',NULL,1,1755869979706);
INSERT INTO BotActivity VALUES('cmemvnlwf00a9i2z00abcw12e','checking_questions','Yanıtsız sorular kontrol ediliyor...',NULL,1,1755869988255);
INSERT INTO BotActivity VALUES('cmemvnlwh00aai2z07w54s33a','found_question','Soru bulundu: "Bu ürünün garanti süresi nedir?..."',NULL,1,1755869988258);
INSERT INTO BotActivity VALUES('cmemvnlwk00abi2z0qwnb3inr','getting_ai_response','Yapay zekadan yanıt alınıyor...',NULL,1,1755869988260);
INSERT INTO BotActivity VALUES('cmemvnpqk00aci2z01vr8xnx7','ai_response_received','Yapay zeka yanıtı alındı',NULL,1,1755869993229);
INSERT INTO BotActivity VALUES('cmemvnpql00adi2z0ewarut4d','sending_answer','Yanıt hazırlandı ve gönderilecek...',NULL,1,1755869993230);
INSERT INTO BotActivity VALUES('cmemvnqik00aei2z02st3zr5n','answer_sent','Yanıt gönderildi! Soru: "Bu ürünün garanti süresi nedir..."',NULL,1,1755869994236);
INSERT INTO BotActivity VALUES('cmemvnsu500afi2z0o2jmlay6','waiting','Sonraki kontrol: 16:40:57',NULL,1,1755869997246);
INSERT INTO BotActivity VALUES('cmemvo0qg00agi2z0cmygcwz9','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755870007480);
INSERT INTO BotActivity VALUES('cmemvo0th00ahi2z0pg36a9zq','no_questions','Yeni soru bulunamadı',NULL,1,1755870007590);
INSERT INTO BotActivity VALUES('cmemvo2d700aii2z0lwh89twh','waiting','Sonraki kontrol: 16:40:39',NULL,1,1755870009595);
INSERT INTO BotActivity VALUES('cmemvonvx00aji2z013c2xh5e','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755870037485);
INSERT INTO BotActivity VALUES('cmemvonyw00aki2z0pg7yh2v7','no_questions','Yeni soru bulunamadı',NULL,1,1755870037593);
INSERT INTO BotActivity VALUES('cmemvopjo00ali2z00ecimlew','waiting','Sonraki kontrol: 16:41:09',NULL,1,1755870039637);
INSERT INTO BotActivity VALUES('cmemvow7700ami2z0b8pbagx3','checking_questions','Yanıtsız sorular kontrol ediliyor...',NULL,1,1755870048259);
INSERT INTO BotActivity VALUES('cmemvow7d00ani2z02vd5wdkp','found_question','Soru bulundu: "Bu ürünün garanti süresi nedir?..."',NULL,1,1755870048266);
INSERT INTO BotActivity VALUES('cmemvow7g00aoi2z09yb1xoko','getting_ai_response','Yapay zekadan yanıt alınıyor...',NULL,1,1755870048269);
INSERT INTO BotActivity VALUES('cmemvoyy800api2z0crrsokxl','ai_response_received','Yapay zeka yanıtı alındı',NULL,1,1755870051825);
INSERT INTO BotActivity VALUES('cmemvoyye00aqi2z0283bsc40','sending_answer','Yanıt hazırlandı ve gönderilecek...',NULL,1,1755870051831);
INSERT INTO BotActivity VALUES('cmemvozqe00ari2z03hbyc62s','answer_sent','Yanıt gönderildi! Soru: "Bu ürünün garanti süresi nedir..."',NULL,1,1755870052839);
INSERT INTO BotActivity VALUES('cmemvp21x00asi2z0lofs5om3','waiting','Sonraki kontrol: 16:41:55',NULL,1,1755870055846);
INSERT INTO BotActivity VALUES('cmemvpb1400ati2z0wjoc6u96','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755870067480);
INSERT INTO BotActivity VALUES('cmemvpb5k00aui2z0vzcm42ul','no_questions','Yeni soru bulunamadı',NULL,1,1755870067640);
INSERT INTO BotActivity VALUES('cmemvpcpc00avi2z0s6wd1i80','waiting','Sonraki kontrol: 16:41:39',NULL,1,1755870069649);
INSERT INTO BotActivity VALUES('cmemvpy6n00awi2z0fpzt1bj4','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755870097488);
INSERT INTO BotActivity VALUES('cmemvpy9f00axi2z09hnnia0z','no_questions','Yeni soru bulunamadı',NULL,1,1755870097587);
INSERT INTO BotActivity VALUES('cmemvpzt600ayi2z02cko8q73','waiting','Sonraki kontrol: 16:42:09',NULL,1,1755870099594);
INSERT INTO BotActivity VALUES('cmemvq6hr00azi2z0r8305a7w','checking_questions','Yanıtsız sorular kontrol ediliyor...',NULL,1,1755870108256);
INSERT INTO BotActivity VALUES('cmemvq6hx00b0i2z0t5x44pbo','found_question','Soru bulundu: "Bu ürünün garanti süresi nedir?..."',NULL,1,1755870108262);
INSERT INTO BotActivity VALUES('cmemvq6i100b1i2z00yxj0laa','getting_ai_response','Yapay zekadan yanıt alınıyor...',NULL,1,1755870108265);
INSERT INTO BotActivity VALUES('cmemvq82900b2i2z08psmh18t','ai_response_received','Yapay zeka yanıtı alındı',NULL,1,1755870110289);
INSERT INTO BotActivity VALUES('cmemvq82f00b3i2z0t3zs1mnv','sending_answer','Yanıt hazırlandı ve gönderilecek...',NULL,1,1755870110295);
INSERT INTO BotActivity VALUES('cmemvq8ug00b4i2z0gepdkqlf','answer_sent','Yanıt gönderildi! Soru: "Bu ürünün garanti süresi nedir..."',NULL,1,1755870111304);
INSERT INTO BotActivity VALUES('cmemvqb5z00b5i2z0k8jk5kil','waiting','Sonraki kontrol: 16:42:54',NULL,1,1755870114311);
INSERT INTO BotActivity VALUES('cmemvqlbu00b6i2z06328phsc','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755870127482);
INSERT INTO BotActivity VALUES('cmemvqlff00b7i2z0e7qhxom5','no_questions','Yeni soru bulunamadı',NULL,1,1755870127611);
INSERT INTO BotActivity VALUES('cmemvqmzd00b8i2z0y8lj1bd2','waiting','Sonraki kontrol: 16:42:39',NULL,1,1755870129625);
INSERT INTO BotActivity VALUES('cmemvr8ha00b9i2z096udhn6b','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755870157486);
INSERT INTO BotActivity VALUES('cmemvr8kt00bai2z0p2nrn5jf','no_questions','Yeni soru bulunamadı',NULL,1,1755870157614);
INSERT INTO BotActivity VALUES('cmemvra5400bbi2z0grr41p9q','waiting','Sonraki kontrol: 16:43:09',NULL,1,1755870159641);
INSERT INTO BotActivity VALUES('cmemvrgsj00bci2z08zphdpno','checking_questions','Yanıtsız sorular kontrol ediliyor...',NULL,1,1755870168259);
INSERT INTO BotActivity VALUES('cmemvrgsn00bdi2z0vjzoip3l','found_question','Soru bulundu: "Bu ürünün garanti süresi nedir?..."',NULL,1,1755870168263);
INSERT INTO BotActivity VALUES('cmemvrgsp00bei2z0ild5f2bk','getting_ai_response','Yapay zekadan yanıt alınıyor...',NULL,1,1755870168265);
INSERT INTO BotActivity VALUES('cmemvrikn00bfi2z0pxoz0205','ai_response_received','Yapay zeka yanıtı alındı',NULL,1,1755870170567);
INSERT INTO BotActivity VALUES('cmemvriks00bgi2z02meler7v','sending_answer','Yanıt hazırlandı ve gönderilecek...',NULL,1,1755870170573);
INSERT INTO BotActivity VALUES('cmemvrjct00bhi2z0cqbzsbnm','answer_sent','Yanıt gönderildi! Soru: "Bu ürünün garanti süresi nedir..."',NULL,1,1755870171581);
INSERT INTO BotActivity VALUES('cmemvrloe00bii2z0iultztqq','waiting','Sonraki kontrol: 16:43:54',NULL,1,1755870174590);
INSERT INTO BotActivity VALUES('cmemvrvmk00bji2z0x38p0gs3','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755870187484);
INSERT INTO BotActivity VALUES('cmemvrvpp00bki2z05kt16kv6','no_questions','Yeni soru bulunamadı',NULL,1,1755870187598);
INSERT INTO BotActivity VALUES('cmemvrx9s00bli2z0shy9b93a','waiting','Sonraki kontrol: 16:43:39',NULL,1,1755870189617);
INSERT INTO BotActivity VALUES('cmemvsirs00bmi2z0rfjq9lan','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755870217480);
INSERT INTO BotActivity VALUES('cmemvsivc00bni2z0kst3dhq8','no_questions','Yeni soru bulunamadı',NULL,1,1755870217609);
INSERT INTO BotActivity VALUES('cmemvskf200boi2z0zy14cm95','waiting','Sonraki kontrol: 16:44:09',NULL,1,1755870219614);
INSERT INTO BotActivity VALUES('cmemvsr3000bpi2z0sm4uh1g0','checking_questions','Yanıtsız sorular kontrol ediliyor...',NULL,1,1755870228253);
INSERT INTO BotActivity VALUES('cmemvsr3200bqi2z0y5n4gbon','found_question','Soru bulundu: "Bu ürünün garanti süresi nedir?..."',NULL,1,1755870228254);
INSERT INTO BotActivity VALUES('cmemvsr3300bri2z0k1nfes2w','getting_ai_response','Yapay zekadan yanıt alınıyor...',NULL,1,1755870228256);
INSERT INTO BotActivity VALUES('cmemvsuvs00bsi2z04bt9sj7q','ai_response_received','Yapay zeka yanıtı alındı',NULL,1,1755870233176);
INSERT INTO BotActivity VALUES('cmemvsuvu00bti2z0zqjjct23','sending_answer','Yanıt hazırlandı ve gönderilecek...',NULL,1,1755870233178);
INSERT INTO BotActivity VALUES('cmemvsvnp00bui2z0ootrfomd','answer_sent','Yanıt gönderildi! Soru: "Bu ürünün garanti süresi nedir..."',NULL,1,1755870234182);
INSERT INTO BotActivity VALUES('cmemvsxz700bvi2z0rs56p8jf','waiting','Sonraki kontrol: 16:44:57',NULL,1,1755870237188);
INSERT INTO BotActivity VALUES('cmemvt5x600bwi2z0czhpu58q','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755870247483);
INSERT INTO BotActivity VALUES('cmemvt5zy00bxi2z0iw4frm8k','no_questions','Yeni soru bulunamadı',NULL,1,1755870247582);
INSERT INTO BotActivity VALUES('cmemvt7jp00byi2z0be2ejtuu','waiting','Sonraki kontrol: 16:44:39',NULL,1,1755870249589);
INSERT INTO BotActivity VALUES('cmemvtt2l00bzi2z0m37xb9qw','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755870277485);
INSERT INTO BotActivity VALUES('cmemvtt6000c0i2z0wbi1zz7p','no_questions','Yeni soru bulunamadı',NULL,1,1755870277609);
INSERT INTO BotActivity VALUES('cmemvtupy00c1i2z0lxawajfj','waiting','Sonraki kontrol: 16:45:09',NULL,1,1755870279623);
INSERT INTO BotActivity VALUES('cmemvu1dx00c2i2z0pt1kiaw4','checking_questions','Yanıtsız sorular kontrol ediliyor...',NULL,1,1755870288262);
INSERT INTO BotActivity VALUES('cmemvu1e500c3i2z0zzfpcdiu','found_question','Soru bulundu: "Bu ürünün garanti süresi nedir?..."',NULL,1,1755870288270);
INSERT INTO BotActivity VALUES('cmemvu1eb00c4i2z0i5jv1z13','getting_ai_response','Yapay zekadan yanıt alınıyor...',NULL,1,1755870288276);
INSERT INTO BotActivity VALUES('cmemvu3gk00c5i2z0h9es2phy','ai_response_received','Yapay zeka yanıtı alındı',NULL,1,1755870290949);
INSERT INTO BotActivity VALUES('cmemvu3gt00c6i2z08gokaj7s','sending_answer','Yanıt hazırlandı ve gönderilecek...',NULL,1,1755870290957);
INSERT INTO BotActivity VALUES('cmemvu48s00c7i2z035a6r1i8','answer_sent','Yanıt gönderildi! Soru: "Bu ürünün garanti süresi nedir..."',NULL,1,1755870291964);
INSERT INTO BotActivity VALUES('cmemvu6ka00c8i2z0sdkkqfzg','waiting','Sonraki kontrol: 16:45:54',NULL,1,1755870294970);
INSERT INTO BotActivity VALUES('cmemvug7z00c9i2z0flahw34x','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755870307487);
INSERT INTO BotActivity VALUES('cmemvugbc00cai2z0dbyfhwod','no_questions','Yeni soru bulunamadı',NULL,1,1755870307608);
INSERT INTO BotActivity VALUES('cmemvuhv400cbi2z0w20hvbb8','waiting','Sonraki kontrol: 16:45:39',NULL,1,1755870309616);
INSERT INTO BotActivity VALUES('cmemvv3e300cci2z0zl8m0rts','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755870337515);
INSERT INTO BotActivity VALUES('cmemvv3ic00cdi2z0wdcqo2jp','no_questions','Yeni soru bulunamadı',NULL,1,1755870337669);
INSERT INTO BotActivity VALUES('cmemvv51z00cei2z06elhnt40','waiting','Sonraki kontrol: 16:46:09',NULL,1,1755870339672);
INSERT INTO BotActivity VALUES('cmemvzknc00cfi2z0krpnxphu','waiting','Bot 60 saniye aralıklarla çalışmaya başladı',NULL,1,1755870546504);
INSERT INTO BotActivity VALUES('cmemvzkne00cgi2z020haemay','checking','Yanıtsız sorular kontrol ediliyor...',NULL,1,1755870546507);
INSERT INTO BotActivity VALUES('cmemvzkzh00chi2z0v70jzola','no_questions','Yanıtsız soru bulunamadı',NULL,1,1755870546941);
INSERT INTO BotActivity VALUES('cmemvzlco00cii2z0oylpabpl','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755870547416);
INSERT INTO BotActivity VALUES('cmemvzldk00cji2z04r6ljast','no_questions','Yeni soru bulunamadı',NULL,1,1755870547448);
INSERT INTO BotActivity VALUES('cmemvzmj600cki2z0uzae2pft','waiting','Sonraki kontrol: 16:50:08',NULL,1,1755870548947);
INSERT INTO BotActivity VALUES('cmemvzmxc00cli2z0f2uh5n9w','waiting','Sonraki kontrol: 16:49:39',NULL,1,1755870549456);
INSERT INTO BotActivity VALUES('cmemw08i500cmi2z0rn5gslpy','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755870577421);
INSERT INTO BotActivity VALUES('cmemw08l400cni2z0p4ejvd9o','no_questions','Yeni soru bulunamadı',NULL,1,1755870577528);
INSERT INTO BotActivity VALUES('cmemw0a4w00coi2z0fm4qhu5f','waiting','Sonraki kontrol: 16:50:09',NULL,1,1755870579537);
INSERT INTO BotActivity VALUES('cmemw0va700cpi2z0ykalirzq','checking','Yanıtsız sorular kontrol ediliyor...',NULL,1,1755870606944);
INSERT INTO BotActivity VALUES('cmemw0vdo00cqi2z0r56507rw','no_questions','Yanıtsız soru bulunamadı',NULL,1,1755870607069);
INSERT INTO BotActivity VALUES('cmemw0vng00cri2z0ln2duqrh','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755870607420);
INSERT INTO BotActivity VALUES('cmemw0voi00csi2z0122lesev','no_questions','Yeni soru bulunamadı',NULL,1,1755870607458);
INSERT INTO BotActivity VALUES('cmemw0wxf00cti2z0kpmilokj','waiting','Sonraki kontrol: 16:51:09',NULL,1,1755870609076);
INSERT INTO BotActivity VALUES('cmemw0x8900cui2z0vuguf8us','waiting','Sonraki kontrol: 16:50:39',NULL,1,1755870609465);
INSERT INTO BotActivity VALUES('cmemw1isv00cvi2z0q9t8j8lc','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755870637424);
INSERT INTO BotActivity VALUES('cmemw1ix100cwi2z0xuces2li','no_questions','Yeni soru bulunamadı',NULL,1,1755870637574);
INSERT INTO BotActivity VALUES('cmemw1kgw00cxi2z09ved1o6s','waiting','Sonraki kontrol: 16:51:09',NULL,1,1755870639584);
INSERT INTO BotActivity VALUES('cmemw25lf00cyi2z03glxdhw8','checking','Yanıtsız sorular kontrol ediliyor...',NULL,1,1755870666964);
INSERT INTO BotActivity VALUES('cmemw25q600czi2z0x1s087ya','no_questions','Yanıtsız soru bulunamadı',NULL,1,1755870667135);
INSERT INTO BotActivity VALUES('cmemw25y200d0i2z0948j3fox','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755870667418);
INSERT INTO BotActivity VALUES('cmemw25zd00d1i2z0ka49k789','no_questions','Yeni soru bulunamadı',NULL,1,1755870667465);
INSERT INTO BotActivity VALUES('cmemw279w00d2i2z0n2yzj1sg','waiting','Sonraki kontrol: 16:52:09',NULL,1,1755870669141);
INSERT INTO BotActivity VALUES('cmemw27j800d3i2z0sbrfurj5','waiting','Sonraki kontrol: 16:51:39',NULL,1,1755870669477);
INSERT INTO BotActivity VALUES('cmemw2t3i00d4i2z0907qlavq','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755870697423);
INSERT INTO BotActivity VALUES('cmemw2t7h00d5i2z0nozj7sw6','no_questions','Yeni soru bulunamadı',NULL,1,1755870697565);
INSERT INTO BotActivity VALUES('cmemw2ur700d6i2z0zrp5y1u2','waiting','Sonraki kontrol: 16:52:09',NULL,1,1755870699572);
INSERT INTO BotActivity VALUES('cmemw3fvp00d7i2z02oeuzsp4','checking','Yanıtsız sorular kontrol ediliyor...',NULL,1,1755870726949);
INSERT INTO BotActivity VALUES('cmemw3g0y00d8i2z0to6sdr4r','no_questions','Yanıtsız soru bulunamadı',NULL,1,1755870727139);
INSERT INTO BotActivity VALUES('cmemw3g8r00d9i2z0rw2bom79','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755870727420);
INSERT INTO BotActivity VALUES('cmemw3g9x00dai2z0crxudqyx','no_questions','Yeni soru bulunamadı',NULL,1,1755870727461);
INSERT INTO BotActivity VALUES('cmemw3hko00dbi2z05z2ghnaf','waiting','Sonraki kontrol: 16:53:09',NULL,1,1755870729144);
INSERT INTO BotActivity VALUES('cmemw3htn00dci2z0mmymhm4q','waiting','Sonraki kontrol: 16:52:39',NULL,1,1755870729467);
INSERT INTO BotActivity VALUES('cmemw43e300ddi2z0bn3nicnd','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755870757419);
INSERT INTO BotActivity VALUES('cmemw43gw00dei2z0wtgvg1ue','no_questions','Yeni soru bulunamadı',NULL,1,1755870757521);
INSERT INTO BotActivity VALUES('cmemw450n00dfi2z064yhuxag','waiting','Sonraki kontrol: 16:53:09',NULL,1,1755870759528);
INSERT INTO BotActivity VALUES('cmemw4q6o00dgi2z00wth6z3f','checking','Yanıtsız sorular kontrol ediliyor...',NULL,1,1755870786961);
INSERT INTO BotActivity VALUES('cmemw4qcw00dhi2z0yvs1f5po','no_questions','Yanıtsız soru bulunamadı',NULL,1,1755870787184);
INSERT INTO BotActivity VALUES('cmemw4qjh00dii2z06gyzws3o','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755870787422);
INSERT INTO BotActivity VALUES('cmemw4qkk00dji2z0c93zfe0o','no_questions','Yeni soru bulunamadı',NULL,1,1755870787460);
INSERT INTO BotActivity VALUES('cmemw4rwo00dki2z0h05whisb','waiting','Sonraki kontrol: 16:54:09',NULL,1,1755870789193);
INSERT INTO BotActivity VALUES('cmemw4s4a00dli2z0262vrc6m','waiting','Sonraki kontrol: 16:53:39',NULL,1,1755870789467);
INSERT INTO BotActivity VALUES('cmemw5dot00dmi2z0dpod6mqu','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755870817422);
INSERT INTO BotActivity VALUES('cmemw5drf00dni2z0j9yn1ror','no_questions','Yeni soru bulunamadı',NULL,1,1755870817515);
INSERT INTO BotActivity VALUES('cmemw5fb500doi2z01x45oeu0','waiting','Sonraki kontrol: 16:54:09',NULL,1,1755870819522);
INSERT INTO BotActivity VALUES('cmemw60h900dpi2z0gtwhii5d','checking','Yanıtsız sorular kontrol ediliyor...',NULL,1,1755870846957);
INSERT INTO BotActivity VALUES('cmemw60k800dqi2z0tnxx4664','no_questions','Yanıtsız soru bulunamadı',NULL,1,1755870847065);
INSERT INTO BotActivity VALUES('cmemw60u500dri2z07odf2nny','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755870847421);
INSERT INTO BotActivity VALUES('cmemw60vr00dsi2z0y2uwr6j2','no_questions','Yeni soru bulunamadı',NULL,1,1755870847479);
INSERT INTO BotActivity VALUES('cmemw623z00dti2z0vmxl850r','waiting','Sonraki kontrol: 16:55:09',NULL,1,1755870849071);
INSERT INTO BotActivity VALUES('cmemw62fi00dui2z0p5z6p2yo','waiting','Sonraki kontrol: 16:54:39',NULL,1,1755870849486);
INSERT INTO BotActivity VALUES('cmemw6nze00dvi2z0velt0t2w','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755870877419);
INSERT INTO BotActivity VALUES('cmemw6o2i00dwi2z0d2iyxqja','no_questions','Yeni soru bulunamadı',NULL,1,1755870877531);
INSERT INTO BotActivity VALUES('cmemw6pma00dxi2z0suzgci46','waiting','Sonraki kontrol: 16:55:09',NULL,1,1755870879538);
INSERT INTO BotActivity VALUES('cmemw7arr00dyi2z0a9gt7rnp','checking','Yanıtsız sorular kontrol ediliyor...',NULL,1,1755870906952);
INSERT INTO BotActivity VALUES('cmemw7aw300dzi2z0m5y79ahn','no_questions','Yanıtsız soru bulunamadı',NULL,1,1755870907107);
INSERT INTO BotActivity VALUES('cmemw7b4r00e0i2z0bt2bwbfu','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755870907420);
INSERT INTO BotActivity VALUES('cmemw7b6200e1i2z02b1jahvx','no_questions','Yeni soru bulunamadı',NULL,1,1755870907466);
INSERT INTO BotActivity VALUES('cmemw7cfw00e2i2z0jyxyzsw6','waiting','Sonraki kontrol: 16:56:09',NULL,1,1755870909116);
INSERT INTO BotActivity VALUES('cmemw7cpu00e3i2z07kfhm2gy','waiting','Sonraki kontrol: 16:55:39',NULL,1,1755870909474);
INSERT INTO BotActivity VALUES('cmemw7ya600e4i2z0l7ra1zoc','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755870937422);
INSERT INTO BotActivity VALUES('cmemw7yd100e5i2z0jlve9b6n','no_questions','Yeni soru bulunamadı',NULL,1,1755870937526);
INSERT INTO BotActivity VALUES('cmemw7zws00e6i2z0679o24m0','waiting','Sonraki kontrol: 16:56:09',NULL,1,1755870939533);
INSERT INTO BotActivity VALUES('cmemw8l2800e7i2z009zox7rf','checking','Yanıtsız sorular kontrol ediliyor...',NULL,1,1755870966944);
INSERT INTO BotActivity VALUES('cmemw8l5r00e8i2z06jiz18of','no_questions','Yanıtsız soru bulunamadı',NULL,1,1755870967071);
INSERT INTO BotActivity VALUES('cmemw8lfg00e9i2z06wf1hk2d','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755870967420);
INSERT INTO BotActivity VALUES('cmemw8lgn00eai2z07t9zbfca','no_questions','Yeni soru bulunamadı',NULL,1,1755870967464);
INSERT INTO BotActivity VALUES('cmemw8mph00ebi2z099ockrej','waiting','Sonraki kontrol: 16:57:09',NULL,1,1755870969077);
INSERT INTO BotActivity VALUES('cmemw8n0g00eci2z0jaqbti96','waiting','Sonraki kontrol: 16:56:39',NULL,1,1755870969473);
INSERT INTO BotActivity VALUES('cmemw98ku00edi2z08b8l50kk','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755870997422);
INSERT INTO BotActivity VALUES('cmemw98nq00eei2z0az5816cr','no_questions','Yeni soru bulunamadı',NULL,1,1755870997526);
INSERT INTO BotActivity VALUES('cmemw9a7j00efi2z02pjf86zb','waiting','Sonraki kontrol: 16:57:09',NULL,1,1755870999536);
INSERT INTO BotActivity VALUES('cmemw9vcr00egi2z06qsvallj','checking','Yanıtsız sorular kontrol ediliyor...',NULL,1,1755871026940);
INSERT INTO BotActivity VALUES('cmemw9vi500ehi2z06cmv6igi','no_questions','Yanıtsız soru bulunamadı',NULL,1,1755871027133);
INSERT INTO BotActivity VALUES('cmemw9vq200eii2z0rz33g1sa','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755871027419);
INSERT INTO BotActivity VALUES('cmemw9vr400eji2z0530nemf3','no_questions','Yeni soru bulunamadı',NULL,1,1755871027457);
INSERT INTO BotActivity VALUES('cmemw9x1t00eki2z0uh76ne9t','waiting','Sonraki kontrol: 16:58:09',NULL,1,1755871029138);
INSERT INTO BotActivity VALUES('cmemw9xas00eli2z0l6jf4q0n','waiting','Sonraki kontrol: 16:57:39',NULL,1,1755871029461);
INSERT INTO BotActivity VALUES('cmemwaive00emi2z0xqsjwayy','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755871057419);
INSERT INTO BotActivity VALUES('cmemwaiy700eni2z0q64knkw4','no_questions','Yeni soru bulunamadı',NULL,1,1755871057520);
INSERT INTO BotActivity VALUES('cmemwakhw00eoi2z0bfrorz4p','waiting','Sonraki kontrol: 16:58:09',NULL,1,1755871059525);
INSERT INTO BotActivity VALUES('cmemwb5nk00epi2z08zc3etmj','checking','Yanıtsız sorular kontrol ediliyor...',NULL,1,1755871086945);
INSERT INTO BotActivity VALUES('cmemwb5rj00eqi2z0rduvtf4m','no_questions','Yanıtsız soru bulunamadı',NULL,1,1755871087087);
INSERT INTO BotActivity VALUES('cmemwb60q00eri2z0c7ylnu7j','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755871087418);
INSERT INTO BotActivity VALUES('cmemwb61o00esi2z0sbuqntl8','no_questions','Yeni soru bulunamadı',NULL,1,1755871087453);
INSERT INTO BotActivity VALUES('cmemwb7ba00eti2z02icdigus','waiting','Sonraki kontrol: 16:59:09',NULL,1,1755871089094);
INSERT INTO BotActivity VALUES('cmemwb7lg00eui2z0ynkebjfd','waiting','Sonraki kontrol: 16:58:39',NULL,1,1755871089461);
INSERT INTO BotActivity VALUES('cmemwbt9j00evi2z0rydfdujx','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755871117543);
INSERT INTO BotActivity VALUES('cmemwbtu500ewi2z04std02ba','no_questions','Yeni soru bulunamadı',NULL,1,1755871118285);
INSERT INTO BotActivity VALUES('cmemwbvhk00exi2z058exnd6c','waiting','Sonraki kontrol: 16:59:10',NULL,1,1755871120424);
INSERT INTO BotActivity VALUES('cmemwc01r00eyi2z0d0h03vz9','waiting','Bot 60 saniye aralıklarla çalışmaya başladı',NULL,1,1755871126336);
INSERT INTO BotActivity VALUES('cmemwc02300ezi2z0gpywcns3','checking','Tablodaki yanıtsız sorular kontrol ediliyor...',NULL,1,1755871126348);
INSERT INTO BotActivity VALUES('cmemwc05s00f0i2z0b8a6ym5r','fetching_new','Tabloda yanıtsız soru kalmadı, yeni sorular çekiliyor...',NULL,1,1755871126481);
INSERT INTO BotActivity VALUES('cmemwc09g00f1i2z0u89m7q6x','no_questions','Yeni soru bulunamadı',NULL,1,1755871126612);
INSERT INTO BotActivity VALUES('cmemwc1tg00f2i2z0ciod9q9w','waiting','Sonraki kontrol: 16:59:48',NULL,1,1755871128629);
INSERT INTO BotActivity VALUES('cmemwcfy600f3i2z0lxeidrm5','checking','Yanıtsız sorular kontrol ediliyor...',NULL,1,1755871146942);
INSERT INTO BotActivity VALUES('cmemwcfyw00f4i2z0b1mdpf9q','no_questions','Yanıtsız soru bulunamadı',NULL,1,1755871146969);
INSERT INTO BotActivity VALUES('cmemwcgeh00f5i2z0jkxxvkd7','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755871147530);
INSERT INTO BotActivity VALUES('cmemwcgi200f6i2z0sib95ptp','no_questions','Yeni soru bulunamadı',NULL,1,1755871147658);
INSERT INTO BotActivity VALUES('cmemwchik00f7i2z0p5tm8c8k','waiting','Sonraki kontrol: 17:00:08',NULL,1,1755871148972);
INSERT INTO BotActivity VALUES('cmemwci1s00f8i2z0ljivvgy7','waiting','Sonraki kontrol: 16:59:39',NULL,1,1755871149665);
INSERT INTO BotActivity VALUES('cmemwd3jy00f9i2z0gvl98g22','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755871177534);
INSERT INTO BotActivity VALUES('cmemwd3n500fai2z0q6bz7trs','no_questions','Yeni soru bulunamadı',NULL,1,1755871177649);
INSERT INTO BotActivity VALUES('cmemwd56x00fbi2z0h1at19ih','waiting','Sonraki kontrol: 17:00:09',NULL,1,1755871179657);
INSERT INTO BotActivity VALUES('cmemwdak600fci2z0a3fhynio','checking','Tablodaki yanıtsız sorular kontrol ediliyor...',NULL,1,1755871186615);
INSERT INTO BotActivity VALUES('cmemwdaki00fdi2z0dj4pz7g5','fetching_new','Tabloda yanıtsız soru kalmadı, yeni sorular çekiliyor...',NULL,1,1755871186626);
INSERT INTO BotActivity VALUES('cmemwdant00fei2z00mbp3bgp','no_questions','Yeni soru bulunamadı',NULL,1,1755871186745);
INSERT INTO BotActivity VALUES('cmemwdc7n00ffi2z0koyx87ys','waiting','Sonraki kontrol: 17:00:48',NULL,1,1755871188756);
INSERT INTO BotActivity VALUES('cmemwdq9000fgi2z0ech2qgzl','checking','Yanıtsız sorular kontrol ediliyor...',NULL,1,1755871206949);
INSERT INTO BotActivity VALUES('cmemwdq9m00fhi2z0f6rraocx','no_questions','Yanıtsız soru bulunamadı',NULL,1,1755871206970);
INSERT INTO BotActivity VALUES('cmemwdqpa00fii2z0c7ixieh7','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755871207535);
INSERT INTO BotActivity VALUES('cmemwdqtj00fji2z08wzmednf','no_questions','Yeni soru bulunamadı',NULL,1,1755871207687);
INSERT INTO BotActivity VALUES('cmemwdrta00fki2z0w9ohjmbq','waiting','Sonraki kontrol: 17:01:08',NULL,1,1755871208974);
INSERT INTO BotActivity VALUES('cmemwdsd900fli2z0igbzvb74','waiting','Sonraki kontrol: 17:00:39',NULL,1,1755871209694);
INSERT INTO BotActivity VALUES('cmemwedui00fmi2z0eqomgmke','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755871237530);
INSERT INTO BotActivity VALUES('cmemwedxz00fni2z0vkeji5t2','no_questions','Yeni soru bulunamadı',NULL,1,1755871237656);
INSERT INTO BotActivity VALUES('cmemwefhq00foi2z0lw62mahu','waiting','Sonraki kontrol: 17:01:09',NULL,1,1755871239663);
INSERT INTO BotActivity VALUES('cmemwekv000fpi2z02qudadz2','checking','Tablodaki yanıtsız sorular kontrol ediliyor...',NULL,1,1755871246620);
INSERT INTO BotActivity VALUES('cmemwekvj00fqi2z08g684gad','fetching_new','Tabloda yanıtsız soru kalmadı, yeni sorular çekiliyor...',NULL,1,1755871246640);
INSERT INTO BotActivity VALUES('cmemwekyn00fri2z00cqip9ul','no_questions','Yeni soru bulunamadı',NULL,1,1755871246751);
INSERT INTO BotActivity VALUES('cmemwemik00fsi2z0xkj2mxbh','waiting','Sonraki kontrol: 17:01:48',NULL,1,1755871248764);
INSERT INTO BotActivity VALUES('cmemwf0je00fti2z0pc8sbzk4','checking','Yanıtsız sorular kontrol ediliyor...',NULL,1,1755871266939);
INSERT INTO BotActivity VALUES('cmemwf0ku00fui2z0diue949f','no_questions','Yanıtsız soru bulunamadı',NULL,1,1755871266991);
INSERT INTO BotActivity VALUES('cmemwf0zr00fvi2z0ckqu3v7t','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755871267527);
INSERT INTO BotActivity VALUES('cmemwf14700fwi2z0vx91lxlk','no_questions','Yeni soru bulunamadı',NULL,1,1755871267688);
INSERT INTO BotActivity VALUES('cmemwf24i00fxi2z0eihkzvu2','waiting','Sonraki kontrol: 17:02:08',NULL,1,1755871268995);
INSERT INTO BotActivity VALUES('cmemwf2nx00fyi2z00aidw9cy','waiting','Sonraki kontrol: 17:01:39',NULL,1,1755871269694);
INSERT INTO BotActivity VALUES('cmemwfo5600fzi2z08og2mtep','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755871297531);
INSERT INTO BotActivity VALUES('cmemwfo8v00g0i2z0h3sy2e7n','no_questions','Yeni soru bulunamadı',NULL,1,1755871297664);
INSERT INTO BotActivity VALUES('cmemwfpsu00g1i2z0jwc5sgoq','waiting','Sonraki kontrol: 17:02:09',NULL,1,1755871299678);
INSERT INTO BotActivity VALUES('cmemwfv5o00g2i2z0ef5sjbu9','checking','Tablodaki yanıtsız sorular kontrol ediliyor...',NULL,1,1755871306621);
INSERT INTO BotActivity VALUES('cmemwfv6m00g3i2z055jxgs9e','fetching_new','Tabloda yanıtsız soru kalmadı, yeni sorular çekiliyor...',NULL,1,1755871306654);
INSERT INTO BotActivity VALUES('cmemwfv9l00g4i2z00q521kp5','no_questions','Yeni soru bulunamadı',NULL,1,1755871306762);
INSERT INTO BotActivity VALUES('cmemwfwta00g5i2z0h13lb9ox','waiting','Sonraki kontrol: 17:02:48',NULL,1,1755871308767);
INSERT INTO BotActivity VALUES('cmemwgau000g6i2z0x92nzr0r','checking','Yanıtsız sorular kontrol ediliyor...',NULL,1,1755871326937);
INSERT INTO BotActivity VALUES('cmemwgaue00g7i2z06hpty9ks','no_questions','Yanıtsız soru bulunamadı',NULL,1,1755871326951);
INSERT INTO BotActivity VALUES('cmemwgbaj00g8i2z05ekddmfi','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755871327532);
INSERT INTO BotActivity VALUES('cmemwgbdj00g9i2z0ft8g58q2','no_questions','Yeni soru bulunamadı',NULL,1,1755871327639);
INSERT INTO BotActivity VALUES('cmemwgce200gai2z0u8gzxpnq','waiting','Sonraki kontrol: 17:03:08',NULL,1,1755871328955);
INSERT INTO BotActivity VALUES('cmemwgcx700gbi2z0xdckmbn1','waiting','Sonraki kontrol: 17:02:39',NULL,1,1755871329643);
INSERT INTO BotActivity VALUES('cmemwgyg700gci2z0e9fv3dnf','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755871357544);
INSERT INTO BotActivity VALUES('cmemwgyj000gdi2z0342h9s65','no_questions','Yeni soru bulunamadı',NULL,1,1755871357645);
INSERT INTO BotActivity VALUES('cmemwh02s00gei2z0mj6wym9i','waiting','Sonraki kontrol: 17:03:09',NULL,1,1755871359652);
INSERT INTO BotActivity VALUES('cmemwh5g900gfi2z0pfih0at4','checking','Tablodaki yanıtsız sorular kontrol ediliyor...',NULL,1,1755871366617);
INSERT INTO BotActivity VALUES('cmemwh5gu00ggi2z08kep87ra','fetching_new','Tabloda yanıtsız soru kalmadı, yeni sorular çekiliyor...',NULL,1,1755871366638);
INSERT INTO BotActivity VALUES('cmemwh5jr00ghi2z0x0gyt8kl','no_questions','Yeni soru bulunamadı',NULL,1,1755871366743);
INSERT INTO BotActivity VALUES('cmemwh73j00gii2z0f4qneke6','waiting','Sonraki kontrol: 17:03:48',NULL,1,1755871368751);
INSERT INTO BotActivity VALUES('cmemwhl4x00gji2z0qavn6ash','checking','Yanıtsız sorular kontrol ediliyor...',NULL,1,1755871386945);
INSERT INTO BotActivity VALUES('cmemwhl6p00gki2z0luia7myt','no_questions','Yanıtsız soru bulunamadı',NULL,1,1755871387010);
INSERT INTO BotActivity VALUES('cmemwhll700gli2z0qdjl85y3','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755871387532);
INSERT INTO BotActivity VALUES('cmemwhlp100gmi2z00ixtl6bb','no_questions','Yeni soru bulunamadı',NULL,1,1755871387670);
INSERT INTO BotActivity VALUES('cmemwhmqd00gni2z0onbcp5iy','waiting','Sonraki kontrol: 17:04:09',NULL,1,1755871389014);
INSERT INTO BotActivity VALUES('cmemwhn8s00goi2z02xxg7ok8','waiting','Sonraki kontrol: 17:03:39',NULL,1,1755871389677);
INSERT INTO BotActivity VALUES('cmemwhtoa00gpi2z0s8vdslzf','waiting','Bot çalışmaya başladı',NULL,1,1755871398010);
INSERT INTO BotActivity VALUES('cmemwhtoc00gqi2z0n2t6c0mn','checking','Tablodaki sorular kontrol ediliyor...',NULL,1,1755871398013);
INSERT INTO BotActivity VALUES('cmemwhtor00gri2z00jsffb0p','no_questions','Yanıtsız soru bulunamadı',NULL,1,1755871398028);
INSERT INTO BotActivity VALUES('cmemwhv8h00gsi2z0bwaugjru','waiting','Sonraki kontrol: 17:04:20',NULL,1,1755871400033);
INSERT INTO BotActivity VALUES('cmemwi8qm00gti2z0kb3i3jei','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755871417535);
INSERT INTO BotActivity VALUES('cmemwi8tp00gui2z05fie4pk4','no_questions','Yeni soru bulunamadı',NULL,1,1755871417646);
INSERT INTO BotActivity VALUES('cmemwiadk00gvi2z0infuf9id','waiting','Sonraki kontrol: 17:04:09',NULL,1,1755871419657);
INSERT INTO BotActivity VALUES('cmemwifr100gwi2z017zjv4mk','checking','Tablodaki yanıtsız sorular kontrol ediliyor...',NULL,1,1755871426622);
INSERT INTO BotActivity VALUES('cmemwifrp00gxi2z0v2f3ygfb','fetching_new','Tabloda yanıtsız soru kalmadı, yeni sorular çekiliyor...',NULL,1,1755871426645);
INSERT INTO BotActivity VALUES('cmemwifux00gyi2z0raoqnuv2','no_questions','Yeni soru bulunamadı',NULL,1,1755871426761);
INSERT INTO BotActivity VALUES('cmemwihen00gzi2z0c9hsfc9r','waiting','Sonraki kontrol: 17:04:48',NULL,1,1755871428767);
INSERT INTO BotActivity VALUES('cmemwivfa00h0i2z0cgl83mus','checking','Yanıtsız sorular kontrol ediliyor...',NULL,1,1755871446934);
INSERT INTO BotActivity VALUES('cmemwivfj00h1i2z01yuug71j','no_questions','Yanıtsız soru bulunamadı',NULL,1,1755871446943);
INSERT INTO BotActivity VALUES('cmemwivvr00h2i2z0k06g212h','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755871447528);
INSERT INTO BotActivity VALUES('cmemwivy700h3i2z0qecb9v9p','no_questions','Yeni soru bulunamadı',NULL,1,1755871447616);
INSERT INTO BotActivity VALUES('cmemwiwz600h4i2z01qiph021','waiting','Sonraki kontrol: 17:05:08',NULL,1,1755871448946);
INSERT INTO BotActivity VALUES('cmemwixhv00h5i2z0ds0n4ek2','waiting','Sonraki kontrol: 17:04:39',NULL,1,1755871449620);
INSERT INTO BotActivity VALUES('cmemwj3zl00h6i2z0kra7hkuk','checking','Tablodaki sorular kontrol ediliyor...',NULL,1,1755871458033);
INSERT INTO BotActivity VALUES('cmemwj40100h7i2z0lx701zi5','no_questions','Yanıtsız soru bulunamadı',NULL,1,1755871458049);
INSERT INTO BotActivity VALUES('cmemwj5jo00h8i2z0rzqlp33m','waiting','Sonraki kontrol: 17:05:20',NULL,1,1755871460053);
INSERT INTO BotActivity VALUES('cmemwjj1c00h9i2z0vktmvliq','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755871477537);
INSERT INTO BotActivity VALUES('cmemwjj4u00hai2z06yeoafq6','no_questions','Yeni soru bulunamadı',NULL,1,1755871477663);
INSERT INTO BotActivity VALUES('cmemwjkoi00hbi2z0fg2pls0h','waiting','Sonraki kontrol: 17:05:09',NULL,1,1755871479666);
INSERT INTO BotActivity VALUES('cmemwjq1k00hci2z0f06rtz1v','checking','Tablodaki yanıtsız sorular kontrol ediliyor...',NULL,1,1755871486616);
INSERT INTO BotActivity VALUES('cmemwjq2p00hdi2z0z0q4i8hp','fetching_new','Tabloda yanıtsız soru kalmadı, yeni sorular çekiliyor...',NULL,1,1755871486657);
INSERT INTO BotActivity VALUES('cmemwjq5p00hei2z0sjxl8cqn','no_questions','Yeni soru bulunamadı',NULL,1,1755871486765);
INSERT INTO BotActivity VALUES('cmemwjrpg00hfi2z0rttet374','waiting','Sonraki kontrol: 17:05:48',NULL,1,1755871488773);
INSERT INTO BotActivity VALUES('cmemwqhjg00hgi2z06i2t361h','waiting','Bot çalışmaya başladı',NULL,1,1755871802188);
INSERT INTO BotActivity VALUES('cmemwqhjk00hhi2z0218fjn8x','checking','Tablodaki sorular kontrol ediliyor...',NULL,1,1755871802192);
INSERT INTO BotActivity VALUES('cmemwqhk300hii2z0uke85bdk','no_questions','Yanıtsız soru bulunamadı',NULL,1,1755871802212);
INSERT INTO BotActivity VALUES('cmemwqj3v00hji2z071c67k1p','waiting','Sonraki kontrol: 17:11:04',NULL,1,1755871804219);
INSERT INTO BotActivity VALUES('cmemwqlo300hki2z0le3chujg','checking_questions','Trendyol soruları kontrol ediliyor...',NULL,1,1755871807539);
INSERT INTO BotActivity VALUES('cmemwqlsg00hli2z0c8uw4asx','no_questions','Yeni soru bulunamadı',NULL,1,1755871807697);
INSERT INTO BotActivity VALUES('cmemwqnc800hmi2z0yum7o7l7','waiting','Sonraki kontrol: 17:10:39',NULL,1,1755871809705);
INSERT INTO BotActivity VALUES('cmemwqqix00hni2z0bbjtidi6','waiting','Bot çalışmaya başladı',NULL,1,1755871813833);
INSERT INTO BotActivity VALUES('cmemwqqiz00hoi2z0q0gben7l','checking','Tablodaki sorular kontrol ediliyor...',NULL,1,1755871813836);
INSERT INTO BotActivity VALUES('cmemwqqk300hpi2z0ejzmuf0y','no_questions','Yanıtsız soru bulunamadı',NULL,1,1755871813876);
INSERT INTO BotActivity VALUES('cmemwqs3v00hqi2z0j5hmqco4','waiting','Sonraki kontrol: 17:11:15',NULL,1,1755871815883);
INSERT INTO BotActivity VALUES('cmemwt2bp00hri2z0h01i8bch','waiting','Bot çalışmaya başladı',NULL,1,1755871922438);
INSERT INTO BotActivity VALUES('cmemwt2bs00hsi2z0m3cfl8dk','checking','Tablodaki sorular kontrol ediliyor...',NULL,1,1755871922440);
INSERT INTO BotActivity VALUES('cmemwt2hs00hti2z0yg43vsf0','no_questions','Yanıtsız soru bulunamadı',NULL,1,1755871922657);
INSERT INTO BotActivity VALUES('cmemwt41r00hui2z0bxtuwhy6','waiting','Sonraki kontrol: 17:13:04',NULL,1,1755871924671);
CREATE TABLE IF NOT EXISTS "BotStatus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isRunning" BOOLEAN NOT NULL DEFAULT false,
    "currentStatus" TEXT NOT NULL DEFAULT 'idle',
    "currentMessage" TEXT NOT NULL DEFAULT 'Bot durdu',
    "startedAt" DATETIME,
    "lastCheck" DATETIME,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO BotStatus VALUES('cmemv1vud0000i20uoom1gcf8',0,'waiting','Sonraki kontrol: 17:13:04',1755871922434,1755871924658,1755871924660,1755868974710);
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");
CREATE UNIQUE INDEX "CustomerTag_name_key" ON "CustomerTag"("name");
CREATE UNIQUE INDEX "EmailSend_trackingId_key" ON "EmailSend"("trackingId");
CREATE UNIQUE INDEX "_CustomerToCustomerTag_AB_unique" ON "_CustomerToCustomerTag"("A", "B");
CREATE INDEX "_CustomerToCustomerTag_B_index" ON "_CustomerToCustomerTag"("B");
COMMIT;
