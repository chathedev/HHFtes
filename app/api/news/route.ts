import { NextResponse } from "next/server"

// Function to strip HTML tags from a string
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

export async function GET() {
  // Manually parsed data from the provided RSS XML snippet
  const newsData = [
    {
      title: "Årsmöte HHF",
      link: "https://www.laget.se/HarnosandsHF/News/7880108/Arsmote-HHF",
      pubDate: "Fri, 23 May 2025 17:51:27 GMT",
      description: stripHtml(
        "Hej Medlemmar,<br>Välkomna på årsmöte! Dags att summera säsongen 24/25.<br>Tid: 18:00 23 Juni.<br>Plats: House Be, Strengbergsgatan 2 (Företagshotellet)<br> <br>Erforderliga handlingar kommer skickas ut i tid enligt stadgar.<br/><br/><i>Publicerad: 2025-05-23 19:51</i>",
      ),
      imageUrl: undefined,
    },
    {
      title: "Ny Sportchef för Herrverksamheten",
      link: "https://www.laget.se/HarnosandsHF/News/7714033/Ny-Sportchef-for-Herrverksamheten",
      pubDate: "Fri, 04 Oct 2024 13:21:41 GMT",
      description: stripHtml(
        "Anette Norberg byter sport! <br><br>Sveriges mest framgångsrika curlingspelare Anette Norberg ger sig in i en ny sport. Den tvåfaldiga olympiska guldmedaljören byter stenar mot bollar och klister och väljer att gå in som sportchef för herrlaget i nystartade Härnösands Handbollsförening. <br><br>“ Jag älskar utmaningar och hoppas kunna bidra med min erfarenhet och mina kunskaper även till handbollen” , säger Anette. När jag fick frågan behövde jag inte fundera särskilt länge. Timingen var helt rätt och det blir spännande att vara med på resan i en nystartad förening” , fortsätter hon. <br><br>“ Jag vill bjuda tillbaka och erbjuda dagens ungdomar samma möjligheter som jag fick som barn. Handboll är världens roligaste sport att titta på och jag brinner verkligen för lagidrotter “. <br><br>Från curling till handboll<br><br>Anette Norberg räknas som en av Sveriges mest framgångsrika idrottare genom alla tider. Med 9 SM-guld, 3 VM-guld, 7 EM-guld och 2 OS-guld har hon en meritlista som få kan matcha. Fortfarande aktiv i curlingen, ger hon sig nu in i en helt ny värld och tar sig an en roll som sportchef för herrlaget i Härnösands Handbollsförening i Division 2 Norra. <br><br>“ Curling är en extremt tuff sport rent mentalt. Handboll är en fysisk och tuff sport, men det handlar även om inställning och om mental styrka. Jag är övertygad om att jag kan lära killarna en hel del om den sidan av sporten” , säger Anette och fortsätter: <br><br>“ Lagidrotter handlar om att få varje individ att nå sitt yttersta och att prestera för lagets bästa. Där finns tydliga paralleller mellan curling och handboll”. <br><br>Anette Norberg ger spets till den nystartade föreningen<br><br>“ Som Härnösandsbo är jag uppväxt med handboll och staden har alltid varit ett starkt fäste för sporten - både i Norrland och i Sverige. Både Brännan och Härnösands Handbollsklubb är kända över hela Sverige och sammanslagningen till en gemensam förening blir otroligt spännande att vara en del av “, avrundar hon. <br><br>“Vi är så otroligt stolta över att Anette vill vara ombord “. Sara Nylund, ordförande i Härnösands Handbollsförening, har ordet. ” Hon ger vår nystartade förening exakt den injektion vi behöver”, säger hon och lägger till: <br>“Meritlistan talar ett tydligt språk. Anette vet vad som krävs för att vinna och HHF siktar på att avancera genom seriesystemet. Anette kan hjälpa oss att bli det norrländska Mecka för handboll vi vill vara. Vår förening ska vara för alla och vi bygger både på bredd och spets. Anette är definitivt den spets vi behöver. Att hon bjuder tillbaka till Härnösand genom detta känns oerhört stort “! <br><br>Härnösand Handbollsförening har sin seriepremiär 3/10 borta mot Sundsvall och då kan vi räkna med att Anette Norberg håller sig rejält uppdaterad om hur matchen går! <br><br>För mer information kontakta: <br><br> Sara Nyberg, Ordförande Härnösands Handbollsförening. <br><br>Telefon: 070-190 38 90<br><br>E Post: Saramargaretanylund@gmail.com<br><br>Anette Norberg. <br><br>Telefon: 070-390 11 15<br><br>E Post: Anette.curling@hotmail.com <br><br><br>HÄRNÖSANDS HANDBOLLSFÖRENING - TILLSAMMANS SEDAN 2024<br><br>Härnösands Handbollsförening är en nystartad handbollsklubb efter en sammanslagning mellan Brännan (herr) och Härnösands HK (Dam). Föreningen är den största i Härnösand och bygger en verksamhet för både flickor och pojkar. <br><br>Ambitionen är att främja idrottande för alla och att bygga en klubb där både bredd och spets finns. Verksamhetens fokus ligger på att alla - utifrån sina egna förutsättningar - ska ha roligt och känna den värme och gemenskap som finns inom klubben. <br><br>Alla gör lite - ingen gör allt - och vi gör det TILLSAMMANS. <br><br><br/><br/><i>Publicerad: 2024-10-04 15:21</i>",
      ),
      imageUrl: "https://laget001.blob.core.windows.net/11238189_medium.png",
    },
    {
      title: "Handbollsfritids & Teknikskola startar 8/11",
      link: "https://www.laget.se/HarnosandsHF/News/7709515/Handbollsfritids---Teknikskola-startar-8-11",
      pubDate: "Mon, 30 Sep 2024 06:42:54 GMT",
      description: stripHtml(
        "Äntligen dags för Handbollsfritids & Teknikskola igen! <br><br>Härnösands HF kör igång med vårt populära handbollsfritids och teknikskola igen. Starten för detta sker fredag 8/11 mellan klockan 15:30 och 16:30. Åldersgrupper födda 2012 och 2017 är varmt välkomna till Öbackahallen för att finslipa lite detaljer och ha roligt med handbollskompisar! <br><br>Vår satsning på handbollsfritids och teknikskola har visat sig vara ytterst uppskattat av både äldre och yngre barn. De yngsta håller till i B-hallen och de äldsta spelar i A-hallen - och på plats väntar ett gäng duktiga ledare på att förmedla nya kunskaper. <br><br>Fokus för de äldre är teknikträning där man får träna på olika detaljer som man kanske inte hinner med på ordinarie träningar. För de yngre är leken i centrum - även om fokus även där ligger på handboll. Framförallt så är vårt handbollsfritids en perfekt arena för att träffas över åldersgrupperna och för att både lära av - och lära känna - varandra. <br><br>HHF bjuder på ett enklare mellanmål. <br><br>Ta med kompisarna och kom upp till Öbacka!<br><br/><br/><i>Publicerad: 2024-09-30 08:42</i>",
      ),
      imageUrl: undefined,
    },
    {
      title: "F09 vidare till USM steg4",
      link: "https://www.laget.se/HarnosandsHF/News/7526873/F09-vidare-till-USM-steg4",
      pubDate: "Tue, 06 Feb 2024 19:51:45 GMT",
      description: stripHtml(
        "Här kommer en hälsning nerifrån Tumba där tjejer födda 2009 varit och spelat USM i helgen. De är såhär glada efter att tagit sig vidare till steg 4 A. Stort grattis:clap::clap:<br/><br/><i>Publicerad: 2024-02-06 20:51</i>",
      ),
      imageUrl: "https://laget001.blob.core.windows.net/10923470_medium.jpg",
    },
    {
      title: "U8-U10 sammandrag idag på Landgren",
      link: "https://www.laget.se/HarnosandsHF/News/7441531/U8-U10-sammandrag-idag-pa-Landgren",
      pubDate: "Sat, 21 Oct 2023 08:37:08 GMT",
      description: stripHtml(
        "Full fart på Landgrenshallen idag!<br><br>Här pågår sammandrag för pojkar och flickor födda 2013-2015, alltså ett samarrangemang mellan HHK och Brännan.<br><br>Se spelschema i kommentar. Cafeterian är öppen, kom förbi och ta en kopp :coffee: och supporta! <br><br>Till alla spelare önskar vi en riktigt rolig handbollsdag! ??:green_heart:<br><br>________________<br><br>Och PS: vill ni se ännu mera handboll så har vi även en div 1-match att bjuda på: HHK - HK Silwing Troja på Öbacka kl 15:00<br/><br/><i>Publicerad: 2023-10-21 10:37</i>",
      ),
      imageUrl: "https://laget001.blob.core.windows.net/10775099_medium.jpg",
    },
    {
      title: "Hemma match mot HK Silwing Troja",
      link: "https://www.laget.se/HarnosandsHF/News/7439905/Hemma-match-mot-HK-Silwing-Troja",
      pubDate: "Thu, 19 Oct 2023 17:51:00 GMT",
      description: stripHtml(
        "På lördag välkomnar vi HK Silwing Troja till Öbacka - ny match, ny utmaning! <br><br>Från sena onsdagsträningen kan rapporteras bra fart och taggade spelare :boom: Glädjande nog har vi också flera som gör comeback i HHK-gemenskapen, så roligt! :green_heart:<br><br>Och så hoppas vi förstås på publikens viktiga stöd även denna match, varmt välkomna!<br><br>Matchbollen sponsras av Radiator VVS - stort tack! <br><br>___________________<br><br>Entre:<br>Vuxna 80:- <br>Pensionärer 60:-<br>Barn, gymnasieelever och aktiva spelare & ledare i HHK & BHF kostnadsfritt. <br><br>Årskort 600:- <br>Årskort pensionärer 460:-<br><br>Endast Swish<br/><br/><i>Publicerad: 2023-10-19 19:51</i>",
      ),
      imageUrl: "https://laget001.blob.core.windows.net/10772295_medium.jpg",
    },
    {
      title: "Hemma premiär Div 1!",
      link: "https://www.laget.se/HarnosandsHF/News/7426044/Hemma-premiar-Div-1",
      pubDate: "Thu, 05 Oct 2023 18:46:14 GMT",
      description: stripHtml(
        ":boom: På lördag smäller det! :boom:<br><br>Våra damer spelar kl 16.00 deras första hemmamatchen i division 1 och det är efterlängtat! :raised_hands:<br><br>Att VästeråsIrsta HK’s utvecklingslag står för motståndet innebär att det kan dyka upp spelare som emellanåt spelar i handbollens högsta serie Handbollsligan. En riktig utmaning alltså, precis som steget upp i ettan är. <br><br>Så välkomna alla HHK:are och andra handbollsintresserade - nu sluter vi upp på Öbacka och stöttar tjejerna så mycket vi kan!<br>:green_heart::green_heart:<br><br>Matchbollen sponsras denna gång av Lorentzen Maskin AB, det tackar vi för!<br><br>___________________<br><br>Entre:<br>Vuxna 80:- <br>Pensionärer 60:-<br>Barn, gymnasieelever och aktiva spelare & ledare i HHK & BHF kostnadsfritt. <br><br>Årskort 600:- <br>___________________________<br> Foto: fotoogonblicket.se<br/><br/><i>Publicerad: 2023-10-05 20:46</i>",
      ),
      imageUrl: "https://laget001.blob.core.windows.net/10746559_medium.jpg",
    },
    {
      title: "USM idag 1/10!",
      link: "https://www.laget.se/HarnosandsHF/News/7420153/USM-idag-1-10",
      pubDate: "Sun, 01 Oct 2023 07:29:54 GMT",
      description: stripHtml(
        "Kom och kolla på USM mellan 09.00-15.00<br>HHK spelar 2st matcher.<br>10:30 HHK mot Sollentuna HK<br>15:00 HHK mot Strands IF<br>Kom igen nu alla Härntabor - nu fyller vi hallen! <br>Dela gärna!<br/><br/><i>Publicerad: 2023-10-01 09:29</i>",
      ),
      imageUrl: undefined,
    },
    {
      title: "USM-DERBY IDAG KL. 14:00",
      link: "https://www.laget.se/HarnosandsHF/News/7419494/USM-DERBY-IDAG-KL-1400",
      pubDate: "Sat, 30 Sep 2023 10:58:35 GMT",
      description: stripHtml(
        "USM-DERBY IDAG KL. 14:00 HHK-SUNDSVALL I ÖBACKAHALLEN. <br>Kom igen nu alla Härntabor- nu fyller vi hallen! <br>Dela gärna!<br/><br/><i>Publicerad: 2023-09-30 12:58</i>",
      ),
      imageUrl: undefined,
    },
    {
      title: "Kansliet är numera obemannat",
      link: "https://www.laget.se/HarnosandsHF/News/7408513/Kansliet-ar-numera-obemannat",
      pubDate: "Thu, 21 Sep 2023 07:38:28 GMT",
      description: stripHtml(
        "Kansliet är numera obemannat då vår kanslist Poffen har blivit pensionär.<br>Anders Högström är från nu behjälplig vid frågor till föreningen. <br>Ni når honom på telefon 070-667 32 15 eller på föreningens mail kontakt@harnosandshk.se<br>I nödfall e-post andershogstrom@telia.com<br/><br/><i>Publicerad: 2023-09-21 09:38</i>",
      ),
      imageUrl: undefined,
    },
    {
      title: "Kom och prova handboll!",
      link: "https://www.laget.se/HarnosandsHF/News/7407886/Kom-och-prova-handboll",
      pubDate: "Wed, 20 Sep 2023 17:22:18 GMT",
      description: stripHtml(
        "? Kom och spela handboll med oss! ?<br><br>De flesta lag har precis börjat träna och de yngsta står i startgroparna. <br><br>F 2007-2008<br>Tisdag 17.00-18.30<br>Fredag 18.00-19.30<br>Söndag 19.00-20.30<br>Öbacka A<br><br>F 2009<br>Måndag 17-18 Öbacka B<br>(Torsdag 21-22 Öbacka B)*<br>Fredag 17-18 Landgren<br>(* börjar med torsdagar när fotbollen är slut)<br><br>F 2010<br>Tisdag 20-21:30 Landgren<br>Fredag 16:30-17:45 Öbacka B <br>(Söndagar 18:30-20:00 Landgren i oktober när fotbollen är slut)<br><br>F 2011<br>Tisdag 16.30-18.00 Landgren <br>Torsdag 16.30-18.00 Öbacka B<br>+ teknikskola fredag<br><br>F 2012 <br>Torsdag 16.30-17.30 Franzén. Söndag 16.00-17.00 Öbacka. <br>Gäller från 1 oktober (nu olika från vecka till vecka beroende på fotbollen)<br>+ teknikskola fredag<br><br>F 2013 <br>Tisdag 18.45-20.15 Geresta<br>Söndag 16.15-17.45 Geresta<br>+ teknikskola fredag <br><br>F 2014<br>Måndag 18:30-19:30 Geresta<br>Söndag 15-16:30 Geresta.<br>Start den 18/9<br>+ handbollsfritids fredag<br><br>F 2015<br>Måndag 16.30-17.30 Geresta. <br>+ handbollsfritids fredag<br><br>F 2016<br>Tisdag 17.45-18.45 på Geresta. Start den 19/9.<br>+ handbollsfritids fredag<br><br>Teknikskola (F 2011, 2012, 2013) och Handbollsfritids (F 2014, 2015, 2016) fredagar kl 15:30 på Öbacka. <br>Start den 29/9<br><br>Och lika välkomna som alla handbollssugna tjejer är till oss i HHK, lika välkomna är alla killar till vår samarbetsklubb Brännans Handbollsförening!<br><br/><br/><i>Publicerad: 2023-09-20 19:22</i>",
      ),
      imageUrl: "https://laget001.blob.core.windows.net/10716258_medium.jpg",
    },
    {
      title: "Fina prestationer i helgens Cuper av HHK",
      link: "https://www.laget.se/HarnosandsHF/News/7184901/Fina-prestationer-i-helgens-Cuper-av-HHK",
      pubDate: "Mon, 09 Jan 2023 07:41:21 GMT",
      description: stripHtml(
        "I helgen deltog HHK i både Kopparcupen och Umeå handbollsfestival.<br>F12 vann A-Finalen i Falun<br>F14 vann A-Finalen i Umeå <br>F16 vann B-Finalen i Umeå<br>F11 som spelade F12 klassen vann B-Finalen i Umeå<br>Grattis till alla lag och väl kämpat. <br><br/><br/><i>Publicerad: 2023-01-09 08:41</i>",
      ),
      imageUrl: "https://laget001.blob.core.windows.net/10322664_medium.jpg",
    },
    {
      title: "HHK F08-Tumba kl16.00 Öbacka!",
      link: "https://www.laget.se/HarnosandsHF/News/7112783/HHK-F08-Tumba-kl1600-Obacka",
      pubDate: "Sat, 15 Oct 2022 09:06:41 GMT",
      description: stripHtml(
        "Idag spelas det SM på öbacka, kl 16.00 möter våra duktiga F08 Tumba HK! Dom behöver hjälp från läktaren så alla som kan ta er dit!!! På med gröna tröjor och heja fram dom!<br/><br/><i>Publicerad: 2022-10-15 11:06</i>",
      ),
      imageUrl: undefined,
    },
    {
      title: "Handbollens dag 17e Sept",
      link: "https://www.laget.se/HarnosandsHF/News/7076197/Handbollens-dag-17e-Sept",
      pubDate: "Tue, 13 Sep 2022 10:24:27 GMT",
      description: stripHtml(
        "På lördag är det Handbollens dag!<br>Det är en del av Handboll Nu-veckan där svensk handboll vill synliggöra den roliga sporten handboll!<br>Det blir matcher, tävlingar, utmaningar, tipspromenad mm! <br>Brännans handbollsförening, Härnösands handbollsklubb och handbollsgymnasiet arrangerar! Välkomna!<br/><br/><i>Publicerad: 2022-09-13 12:24</i>",
      ),
      imageUrl: "https://laget001.blob.core.windows.net/10126828_medium.jpg",
    },
    {
      title: "Påminnelse - Kallelse till Årsmöte HHK 2022-08-22",
      link: "https://www.laget.se/HarnosandsHF/News/7025098/Paminnelse-Kallelse-till-Arsmote-HHK-2022-08-22",
      pubDate: "Wed, 20 Jul 2022 18:00:00 GMT",
      description: stripHtml(
        "Härmed kallas alla medlemmar i Härnösands handbollsklubb till ÅRSMÖTE.<br><br>Måndag den 22a augusti klockan 18.30<br>HHK kansli, SkepparKarlsgränd 11<br><br>Eventuella förslag eller motioner till årsmötet skall vara styrelsen tillhanda senast 2022-06-23, kan lämnas på kansliet.<br><br>Program: Sedvanliga årsmötesförhandlingar med information om bokslut, budget och verksamhetsplan för kommande säsong, val av ny styrelse. <br><br>Ett årsmöte är en förenings viktigaste möte där den enskilde medlemmen kan påverka hur föreningen skall arbeta under kommande säsong. Ofta är det våra spelare som är medlemmar men där är det föräldrarna som representerar på årsmötet.<br/><br/><i>Publicerad: 2022-07-20 20:00</i>",
      ),
      imageUrl: undefined,
    },
    {
      title: "Årsmöte skjuts upp till 2022-08-22",
      link: "https://www.laget.se/HarnosandsHF/News/7025096/Arsmote-skjuts-upp-till-2022-08-22",
      pubDate: "Thu, 30 Jun 2022 20:22:43 GMT",
      description: stripHtml(
        "Årsmöte 2022-06-30 skjuts upp till 2022-08-22 kl 18.30.<br>Detta med anledning av endast styrelsens medlemmar närvarande.<br>Enligt våra stadgar kan inte årsmötet genomföras utan medlemmars närvaro.<br>Välkommen till nytt Årsmöte 2022-08-22 kl 18.30 på HHK Kansli.<br>----------------------------------------------------------------------------------------<br>Härmed kallas alla medlemmar i Härnösands handbollsklubb till ÅRSMÖTE.<br><br>Torsdag den 30e juni klockan 18.30<br>HHK kansli, SkepparKarlsgränd 11<br><br>Eventuella förslag eller motioner till årsmötet skall vara styrelsen tillhanda senast 2022-06-23, kan lämnas på kansliet.<br><br>Program: Sedvanliga årsmötesförhandlingar med information om bokslut, budget och verksamhetsplan för kommande säsong, val av ny styrelse. <br><br>Ett årsmöte är en förenings viktigaste möte där den enskilde medlemmen kan påverka hur föreningen skall arbeta under kommande säsong. Ofta är det våra spelare som är medlemmar men där är det föräldrarna som representerar på årsmötet.<br>Årsmöteshandlingar kommer att skickas ut senast en vecka innan årsmötet.<br><br/><br/><i>Publicerad: 2022-06-30 22:22</i>",
      ),
      imageUrl: undefined,
    },
    {
      title: "Kallelse årsmöte HHK",
      link: "https://www.laget.se/HarnosandsHF/News/7007158/Kallelse-arsmote-HHK",
      pubDate: "Wed, 08 Jun 2022 18:02:51 GMT",
      description: stripHtml(
        "Härmed kallas alla medlemmar i Härnösands handbollsklubb till ÅRSMÖTE.<br><br>Torsdag den 30e juni klockan 18.30<br>HHK kansli, SkepparKarlsgränd 11<br><br>Eventuella förslag eller motioner till årsmötet skall vara styrelsen tillhanda senast 2022-06-23, kan lämnas på kansliet.<br><br>Program: Sedvanliga årsmötesförhandlingar med information om bokslut, budget och verksamhetsplan för kommande säsong, val av ny styrelse. <br><br>Ett årsmöte är en förenings viktigaste möte där den enskilde medlemmen kan påverka hur föreningen skall arbeta under kommande säsong. Ofta är det våra spelare som är medlemmar men där är det föräldrarna som representerar på årsmötet.<br>Årsmöteshandlingar kommer att skickas ut senast en vecka innan årsmötet.<br><br/><br/><i>Publicerad: 2022-06-08 20:02</i>",
      ),
      imageUrl: undefined,
    },
    {
      title: "Inställd match F14 imorgon söndag",
      link: "https://www.laget.se/HarnosandsHF/News/6942606/Installd-match-F14-imorgon-sondag",
      pubDate: "Sat, 09 Apr 2022 18:07:54 GMT",
      description: stripHtml(
        "Matchen mellan 14 imorgon söndag ställs tyvärr in. <br/><br/><i>Publicerad: 2022-04-09 20:07</i>",
      ),
      imageUrl: undefined,
    },
    {
      title: "INSTÄLLD match F14 serien",
      link: "https://www.laget.se/HarnosandsHF/News/6940533/INSTALLD-match-F14-serien",
      pubDate: "Thu, 07 Apr 2022 19:05:00 GMT",
      description: stripHtml(
        "Matchen mellan 14 imorgon söndag ställs tyvärr in.<br><br><br/><br/><i>Publicerad: 2022-04-07 21:05</i>",
      ),
      imageUrl: undefined,
    },
    {
      title: "Säsongsavslutning 5:e April 17:30-19:00",
      link: "https://www.laget.se/HarnosandsHF/News/6923313/Sasongsavslutning-5e-April-1730-1900",
      pubDate: "Mon, 04 Apr 2022 15:49:00 GMT",
      description: stripHtml(
        "OBS uppdaterad starttid 17:30!<br>Tisdag 5:e April är det säsongsavslutning för samtliga HHK lag.<br>Vi håller till på Öbacka hallen.<br>Det blir div. aktiviteter och medaljutdelning till alla spelare.<br>Varmt välkomna.<br/><br/><i>Publicerad: 2022-04-04 17:49</i>",
      ),
      imageUrl: "https://laget001.blob.core.windows.net/9867129_medium.jpg",
    },
    {
      id: "1",
      title: "Storseger för Härnösands HF i säsongspremiären!",
      date: "2024-02-29",
      summary: "Härnösands HF inledde säsongen starkt med en övertygande seger på hemmaplan.",
      imageUrl: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "2",
      title: "Nyförvärv förstärker truppen inför vårsäsongen",
      date: "2024-02-25",
      summary: "Klubben presenterar stolt två nya spelare som ansluter till laget.",
      imageUrl: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "3",
      title: "Framgångsrik ungdomsturnering i Härnösand",
      date: "2024-02-20",
      summary: "Helgens ungdomsturnering lockade lag från hela regionen och blev en stor succé.",
      imageUrl: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "4",
      title: "Träningsläger i Spanien gav mersmak",
      date: "2024-02-15",
      summary: "A-laget har återvänt från ett intensivt och givande träningsläger i södra Spanien.",
      imageUrl: "/placeholder.svg?height=400&width=600",
    },
  ]

  return NextResponse.json(newsData)
}
