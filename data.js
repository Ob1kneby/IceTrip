// Iceland Ring Road 2026 — Full Trip Data
// Excursions kept: Glacier Xtreme, Katla cave, Canyoning, Whale watching, Earth Lagoon, Þórsmörk bus
// Removed: Sky Lagoon, Jökulsárlón kayak
// Puffins added: Dyrhólaey (Day 4), Borgarfjörður Eystri (Day 9), Ingólfshöfði (Day 8)
// F-road opening data from vegagerdin.is official historical records

const FROAD_DATA = {
  F206_Laki: {
    name: "F206 — Lakagígar (Laki Craters)",
    liveUrl: "https://umferdin.is/en/road/91381",
    historical: { 2021:"25 Jun", 2022:"1 Jul", 2023:"12 Jun", 2024:"18 Jun", 2025:"12 Jun" },
    earliest: "12 June", latest: "1 July", average: "20 June",
    risk: "medium", // opens Jun 30 some years, Jul 1 others — tight for Jul 4
    tripDay: 5, tripDate: "Jul 4",
    note: "Average opening is Jun 20 — likely open for your Jul 4 date but always verify at umferdin.is/en/road/91381 morning of departure. In 2022 it didn't open until July 1 so it's not guaranteed."
  },
  F208_Landmannalaugar: {
    name: "F208 north — Sigalda to Landmannalaugar",
    liveUrl: "https://umferdin.is/en",
    historical: { 2021:"12 Jun", 2022:"23 Jun", 2023:"1 Jun", 2024:"12 Jun", 2025:"23 May" },
    earliest: "23 May", latest: "23 June", average: "2 June",
    risk: "low", // reliably open well before Jul 1
    tripDay: 2, tripDate: "Jul 1",
    note: "Average opening Jun 2 — almost certainly open for your Jul 1 visit. Lowest risk F-road on the trip."
  },
  F88_Askja: {
    name: "F88 — Öskjuvegur (Askja / Dreki)",
    liveUrl: "https://umferdin.is/en",
    historical: { note: "No official table entry — typically opens late June to early July" },
    earliest: "late June", latest: "early July", average: "late June",
    risk: "low",
    tripDay: 11, tripDate: "Jul 10",
    note: "F88 opens late June on average. By Jul 10 it has been open for ~2 weeks in most years. Still check safetravel.is and road.is morning of departure for river crossing conditions."
  }
};

const TRIP_DATA = {
  days: [
    {
      num:1, date:"Jun 30", title:"Arrive Reykjavík",
      sleep:"hostel", accommodation:"Loft HI Hostel, Reykjavík",
      tags:["hostel"], lat:64.1466, lng:-21.9426,
      summary:"Land 10:30am KEF. Pick up truck. Big Bónus shop. Explore city. Hot dogs at Bæjarins Beztu.",
      schedule:[
        {time:"10:30am", desc:"Land at KEF", note:"Allow 30 min baggage + customs"},
        {time:"11:15am", desc:"Pick up 4x4 truck", note:"Confirm F-road insurance in writing before driving off"},
        {time:"12:00pm", desc:"Bónus supermarket — BIG shop", note:"Stock 3–4 days on road. ~$55 for 2 people. Grab camp gas canisters."},
        {time:"1:30pm", desc:"Check in Loft HI Hostel, Bankastrǣti 7"},
        {time:"2:30pm", desc:"Hallgrímskirkja tower", note:"~$11pp. Best city panorama."},
        {time:"3:30pm", desc:"Sun Voyager + Harpa waterfront walk", note:"Free. 20 min."},
        {time:"5:00pm", desc:"Bæjarins Beztu Pylsur hot dogs", note:"Order 'eina með öllu'. ~$4 each."},
        {time:"7:00pm", desc:"Perlan free rooftop deck + city walk", note:"Free. Panoramic 360° views of Reykjavík. No lagoon today — jet lag day."},
      ],
      hikes:[], excursions:[],
      tips:["Iceland tap water is safe and delicious. Never buy bottled water — enormous waste of money.", "Midnight sun starts here on Day 1. Bring a sleep mask or blackout liner for the RTT."],
      warnings:[],
      costs:{ accommodation:45, food:36, activities:11 }
    },
    {
      num:2, date:"Jul 1", title:"Háifoss + Landmannalaugar Rainbow Mountains",
      sleep:"camp", accommodation:"Landmannalaugar campsite",
      tags:["camp","hike","froad"], lat:63.9906, lng:-19.0607,
      summary:"Route 332 to Háifoss gorge. F208 north (no river crossings) to Landmannalaugar rainbow rhyolite mountains.",
      froad:{ id:"F208_Landmannalaugar", risk:"low", note:"Average opening Jun 2 — almost certainly open. Verify at road.is." },
      schedule:[
        {time:"7:30am", desc:"Depart Reykjavík on Ring Road east"},
        {time:"9:00am", desc:"Route 32 → 327/332 to Háifoss", note:"Rough gravel. High clearance essential. Drive slowly."},
        {time:"9:30am", desc:"Háifoss waterfall — rim viewpoint + gorge descent hike", note:"2 hrs total. Parking via Parka.is ~$8."},
        {time:"12:00pm", desc:"Drive south, rejoin Ring Road, east to Hrauneyjar"},
        {time:"2:30pm", desc:"Arrive Landmannalaugar via F208 north", note:"PRE-BOOK parking if arriving 9am–4pm at fi.is. Zero river crossings on this route."},
        {time:"3:00pm", desc:"Brennisteinsalda rainbow volcano loop hike"},
        {time:"5:00pm", desc:"Bláhnúkur Blue Peak hike — best summit panorama"},
        {time:"7:30pm", desc:"Free hot spring soak at the hut"},
        {time:"9:00pm", desc:"Camp Landmannalaugar — ~$25pp, NOT on Camping Card"},
      ],
      hikes:[
        {name:"Háifoss Gorge Descent", distance:"4km RT", difficulty:"Moderate", gain:"300m", time:"1.5–2 hrs", desc:"Scramble into the canyon to the base of Iceland's 4th-highest waterfall (122m). Stand in the mist. Stranger Things S8 filming location. Virtually nobody does this trail — bring waterproofs."},
        {name:"Brennisteinsalda Loop", distance:"4km", difficulty:"Moderate", gain:"200m", time:"90 min", desc:"Circuit around a steam-venting rainbow volcano. Red, green, yellow, white mineral layers. Steam vents hiss from the ground beside the path."},
        {name:"Bláhnúkur Blue Peak", distance:"6km RT", difficulty:"Moderate–Challenging", gain:"350m", time:"2.5 hrs", desc:"Best single viewpoint in Landmannalaugar. The entire valley of rhyolite mountains in every direction. Push through the final steep section — the summit is worth every step."},
      ],
      excursions:[],
      tips:["2026: Landmannalaugar parking requires online reservation if arriving 9am–4pm. Book at fi.is before departure.", "The hot spring soak at the hut is free with your campsite — small, low-key, and completely magical under midnight sun."],
      warnings:["Use F208 NORTH from Hrauneyjar. Do NOT use F225 southern approach — river crossings that void rental insurance."],
      costs:{ accommodation:25, food:22, parking:10 }
    },
    {
      num:3, date:"Jul 2", title:"Skógafoss Trail + Þórsmörk + Þakgil Camp",
      sleep:"camp", accommodation:"Þakgil Canyon Campsite",
      tags:["camp","hike","excursion"], lat:63.5309, lng:-18.8887,
      summary:"Skógafoss river trail upstream past 10+ waterfalls. Sterna bus into Þórsmörk valley. Stakkholtsgjá cave canyon. Camp inside Þakgil canyon.",
      schedule:[
        {time:"7:00am", desc:"Exit Landmannalaugar via F208 south"},
        {time:"9:00am", desc:"Skógafoss waterfall — river trail hike upstream", note:"Parking ~$8 via Parka.is"},
        {time:"11:30am", desc:"Drive to Hvolsvöllur. Board Sterna bus to Þórsmörk", note:"PRE-BOOK sterna.is, ~$44pp return. Leave truck at Midgard."},
        {time:"1:30pm", desc:"Þórsmörk — Stakkholtsgjá cave canyon hike"},
        {time:"3:30pm", desc:"Valahnúkur summit loop — glacier panorama"},
        {time:"5:00pm", desc:"Return bus to Hvolsvöllur"},
        {time:"6:00pm", desc:"Pick up truck. Drive Road 214 to Þakgil (~45 min gravel)", note:"NOT an F-road."},
        {time:"7:00pm", desc:"Arrive Þakgil canyon campsite", note:"Book: thakgil.is / +354 893 4889"},
      ],
      hikes:[
        {name:"Skógar River Trail Upstream", distance:"Up to 14km one way", difficulty:"Moderate–Challenging", gain:"1000m to pass", time:"Go as far as legs allow", desc:"Follow the Skóga river past 10+ named waterfalls in succession — each more dramatic and crowd-free than the last. Most visitors turn around at 2–4km. The full route ends at the volcanic ridge between Eyjafjallajökull and Mýrdalsjökull."},
        {name:"Stakkholtsgjá Cave Canyon", distance:"5km RT", difficulty:"Moderate", gain:"100m", time:"2 hrs", desc:"A narrow slot canyon that opens into a cave at the end — with a waterfall dropping inside it. The canyon walls close in as you walk, light shifts to a narrow strip above. One of Iceland's most extraordinary secret hikes."},
        {name:"Valahnúkur Summit", distance:"5km", difficulty:"Moderate", gain:"300m", time:"2.5 hrs", desc:"Best single panorama of the Þórsmörk valley. Eyjafjallajökull, Mýrdalsjökull, and Tindfjallajökull glaciers on three sides. Fimmvörðuháls volcanic ridge visible to the north."},
      ],
      excursions:[
        {name:"Sterna Highland Bus — Þórsmörk Return", operator:"sterna.is", price:"$44pp", duration:"All-day transport", url:"https://www.sterna.is", desc:"F249 river crossings into Þórsmörk void rental car insurance. The Sterna bus is the only safe access. Book in advance — fills up in July."}
      ],
      tips:["Þakgil has a cave dining room carved into the canyon cliff face. Eat breakfast there before hiking.", "From the Remundargil loop (Day 4 morning) you see Katla glacier at the ridgeline."],
      warnings:[],
      costs:{ accommodation:20, food:18, activities:44 }
    },
    {
      num:4, date:"Jul 3", title:"Þakgil Hike + Katla Ice Cave + Dyrhólaey Puffins + Vík",
      sleep:"hostel", accommodation:"Vík HI Hostel",
      tags:["hostel","hike","excursion"], lat:63.4190, lng:-19.0055,
      summary:"Morning Remundargil canyon hike. Katla ice cave super-jeep. Dyrhólaey puffin cliffs. Reynisfjara. Vík.",
      schedule:[
        {time:"7:00am", desc:"Morning hike from Þakgil — Remundargil loop", note:"12.5km, 3–4 hrs"},
        {time:"11:00am", desc:"Pack camp, drive to Vík (~45 min)"},
        {time:"1:00pm", desc:"Katla ice cave super-jeep tour (pre-booked)", note:"troll.is or katlatrack.is, ~$90pp"},
        {time:"4:00pm", desc:"Dyrhólaey — puffin cliffs + sea arch", note:"July = peak nesting. Thousands of puffins on the cliffs. Look DOWN from the lighthouse platform. Parking ~$8."},
        {time:"5:30pm", desc:"Reynisfjara black sand beach", note:"⚠️ NEVER turn back to the ocean — sneaker waves are deadly."},
        {time:"6:30pm", desc:"Check in Vík HI Hostel. Cook dinner."},
      ],
      hikes:[
        {name:"Remundargil Canyon Loop", distance:"12.5km", difficulty:"Moderate", gain:"250m", time:"3–5 hrs", desc:"From Þakgil camp, this loop follows canyon rims with Katla glacier views at the ridgeline. Parts are unmarked — download on Wikiloc or Gaia GPS before setting off. Bring water and snacks, nothing on route."},
      ],
      excursions:[
        {name:"Katla Ice Cave Super-Jeep Tour", operator:"Troll Expeditions / Katla Guide (troll.is)", price:"~$90pp", duration:"2–3 hrs", url:"https://www.troll.is", desc:"A modified super-jeep drives onto Mýrdalsjökull glacier, which sits over the active Katla volcano. Cave walls show distinct black ash layers from past eruptions. Totally different from Skaftafell's blue ice cave — darker, more geological, more raw. Only accessible by super-jeep."}
      ],
      tips:["Dyrhólaey puffins: look DOWN from the lighthouse platform — thousands nest on the cliff face directly below your feet. Early morning or evening = most active.", "July is peak puffin season — colonies are fully established, adults carrying fish in their beaks are a common sight."],
      warnings:["Reynisfjara: sneaker waves kill people here every year with zero warning. Never turn your back on the ocean."],
      costs:{ accommodation:45, food:18, activities:90 }
    },
    {
      num:5, date:"Jul 4", title:"Fjáðrárgljúfur + Laki Craters F206/F207",
      sleep:"camp", accommodation:"Blágil Hut Campsite",
      tags:["camp","hike","froad"], lat:64.0707, lng:-18.2378,
      froad:{ id:"F206_Laki", risk:"medium", note:"Average opening Jun 20 — likely open Jul 4, but not guaranteed. Check umferdin.is/en/road/91381 that morning." },
      summary:"Fjáðrárgljúfur canyon. F206/F207 highland loop through 130 Laki craters. Camp at Blágil hut.",
      schedule:[
        {time:"6:30am", desc:"CHECK umferdin.is/en/road/91381 + road.is before leaving", note:"If F207 closed → drive direct to Skaftafell (Day 5 alternate). Register at safetravel.is either way."},
        {time:"7:30am", desc:"Fjáðrárgljúfur canyon — quick stop", note:"Free. 30 min rim walk. Game of Thrones filming location. Parking ~$8."},
        {time:"8:30am", desc:"Turn north on F206 from Ring Road near Kirkjubæjarklaustur", note:"12+ river crossings. Walk each one before driving."},
        {time:"10:30am", desc:"Fagrifoss waterfall — stop and walk (free)"},
        {time:"11:00am", desc:"Laki crater trailhead. Mt. Laki summit hike"},
        {time:"1:00pm", desc:"Visitor Trail through crater interior"},
        {time:"3:00pm", desc:"F207 loop south back to Ring Road"},
        {time:"5:00pm", desc:"Blágil hut campsite", note:"+354 487 4840. Kitchen, toilets, showers. Remote highland sleep."},
      ],
      hikes:[
        {name:"Mt. Laki Summit", distance:"3.5km RT", difficulty:"Moderate", gain:"200m", time:"1–2 hrs", desc:"From the ranger hut, the marked path leads to the summit where you can see the entire 25km row of 130 craters in both directions. The 1783 eruption was one of the most catastrophic in human history — killed 25% of Iceland's population."},
        {name:"Visitor Trail — Crater Interior", distance:"2km loop", difficulty:"Easy", gain:"50m", time:"1 hr", desc:"Walk into the inside of a volcanic crater and through the eruption fissure. Lava fields reclaimed by vivid green moss. The scale and absolute silence are staggering."},
      ],
      excursions:[],
      tips:["Fill to absolute maximum before entering F206. No fuel for 100+ km.", "F206/F207 historical opening: earliest Jun 12, latest Jul 1, average Jun 20. By Jul 4 it is open in 4 out of 5 recent years — but the 2022 outlier (Jul 1) shows it's not guaranteed."],
      warnings:["CRITICAL: Check umferdin.is/en/road/91381 morning of departure. If not yet open, drive directly to Skaftafell — Day 6 plan is unaffected.", "Register at safetravel.is before entering F206. Walk every river crossing before driving."],
      costs:{ accommodation:18, food:20, fuel:70 }
    },
    {
      num:6, date:"Jul 5", title:"Glacier Xtreme Ice Climbing + Svartifoss",
      sleep:"camp", accommodation:"Skaftafell campsite",
      tags:["camp","hike","excursion"], lat:64.0163, lng:-16.9681,
      summary:"Arctic Adventures' Glacier Xtreme tour on Falljökull — rappel crevasses, climb frozen walls. Svartifoss trail at sunset.",
      schedule:[
        {time:"8:00am", desc:"Drive from Blágil east to Skaftafell (~1 hr)"},
        {time:"9:00am", desc:"Arctic Adventures booking hut — check-in + gear fitting", note:"Allow 1 hr before tour. Book: adventures.is ~$242pp"},
        {time:"10:00am", desc:"20-min drive to Falljökull base (transport provided)"},
        {time:"10:30am", desc:"Glacier Xtreme — 7 hrs on Falljökull glacier", note:"8.5 hrs total incl. check-in. Do NOT plan anything else today."},
        {time:"6:00pm", desc:"Return to Skaftafell. Gear off. Rest + eat."},
        {time:"7:30pm", desc:"Svartifoss waterfall trail", note:"Easy, 3.5km RT, 2hrs. Free from visitor centre."},
        {time:"9:30pm", desc:"Set up camp at Skaftafell (Camping Card accepted)"},
      ],
      hikes:[
        {name:"Glacier Xtreme on Falljökull (Vatnajökull)", distance:"~8km", difficulty:"Challenging", gain:"350–400m", time:"7 hrs (8.5 with check-in)", desc:"Falljökull — the 'Falling Glacier' — is an outlet of Vatnajökull, Europe's largest ice cap. You'll hike through dramatic crevasses and ice formations, then climb a vertical blue ice wall with twin ice axes. Max 6 people per guide. All specialized ice-climbing boots (EU 36–50), crampons, helmet, harness, and axe provided. Transport to glacier base included. No experience needed."},
        {name:"Svartifoss Trail", distance:"3.5km RT", difficulty:"Easy–Moderate", gain:"120m", time:"2 hrs", desc:"The Black Waterfall drops over dark hexagonal basalt columns — the same architecture that inspired Hallgrímskirkja church. Do it in the evening light after the glacier. Trailhead at the Skaftafell visitor centre."},
      ],
      excursions:[
        {name:"Glacier Xtreme — Ice Climbing on Falljökull", operator:"Arctic Adventures (adventures.is)", price:"~$242pp", duration:"7 hrs (8.5 with check-in)", url:"https://adventures.is/iceland/day-tours/glacier-tours/glacier-tours-on-vatnajokull/glacier-xtreme-and-ice-climbing/", desc:"Departs: Arctic Adventures Booking Hut, Skaftafell parking lot. Small group ≤6. All glacier gear included. 20-min transport to glacier base. ~8km, 350–400m elevation. Do NOT book anything else within 8.5 hours of start time. Cancellation: 48 hours notice required."}
      ],
      tips:["Don't plan anything else today — the tour is 8.5 hours total with check-in.", "Bring lunch, snacks, and water — not provided. Glacier meltwater is the freshest you'll ever taste and can be drunk directly."],
      warnings:["BOOK IMMEDIATELY — max 6 per group. July slots sell out within days of opening."],
      costs:{ accommodation:16, food:18, activities:242 }
    },
    {
      num:7, date:"Jul 6", title:"Canyoning Under Vatnajökull + Höfn",
      sleep:"hostel", accommodation:"Höfn HI Hostel",
      tags:["hostel","excursion"], lat:64.2621, lng:-15.2124,
      summary:"Half-day canyoning tour — rappel down waterfalls, jump into glacial pools under Vatnajökull. Drive to Höfn. Langoustine dinner.",
      schedule:[
        {time:"9:00am", desc:"Drive from Skaftafell to Haukafell Camp (35 min west of Höfn)", note:"ice-guardians.com, +354 898 2277. Meet point is Haukafell Campsite, Hornafjörður."},
        {time:"9:30am", desc:"Canyoning check-in + wetsuit fitting + safety brief"},
        {time:"10:00am", desc:"Half-day canyoning under Vatnajökull — 4–5 hrs", note:"5mm wetsuit, helmet, harness provided. Rappel waterfalls, jump and slide into glacial pools."},
        {time:"3:00pm", desc:"Coffee/hot choc after tour (included). Drive to Höfn (~35 min)"},
        {time:"4:00pm", desc:"Check in Höfn HI Hostel"},
        {time:"6:00pm", desc:"Langoustine dinner in Höfn", note:"Iceland's langoustine capital. ~$30pp. Pakkhús or Hafnarbuðin."},
        {time:"Midnight", desc:"Glacier terrace sunset from hostel — Vatnajökull glows pink"},
      ],
      hikes:[],
      excursions:[
        {name:"Half-Day Canyoning Under Vatnajökull", operator:"Ice Guardians (ice-guardians.com)", price:"~$278pp (34,900 ISK)", duration:"4–5 hrs", url:"https://ice-guardians.com/tour/half-day-canyoning-under-vatnajokull/", desc:"Iceland's only canyoning operator. Rappel down waterfalls, jump and slide into crystal pools in a river canyon directly under the Vatnajökull ice cap. 5mm wetsuit, helmet, harness, neoprene boots and gloves all included. Max 6 guests: 2 guides. Min age 12. Must be able to swim 20m and hike 5km on uneven terrain. Coffee/hot choc provided after. Photo package available as add-on."}
      ],
      tips:["Bring a towel, dry change of clothes, swimsuit or synthetic sports base, and a waterproof phone case.", "Langoustine dinner tonight: Höfn is Iceland's langoustine capital and it would be criminal not to eat here. Pakkhús has the best bisque."],
      warnings:["Cancellation: 100% fee within 48 hours. 10% fee beyond 48 hours.", "Not recommended for people with back problems or heart conditions."],
      costs:{ accommodation:45, food:55, activities:278 }
    },
    {
      num:8, date:"Jul 7", title:"Ingólfshöfði Puffin Reserve + Stafafell Canyon",
      sleep:"camp", accommodation:"Stafafell Nature Park",
      tags:["camp","hike"], lat:64.4197, lng:-14.8439,
      summary:"Ingólfshöfði nature reserve tractor tour — puffins, great skuas, Arctic terns. Stafafell farm camp. Lónsöræfi hike.",
      schedule:[
        {time:"9:00am", desc:"Drive west from Höfn (~45 min) to Ingólfshöfði tractor meetpoint", note:"Route 1, then sandy track. Look for the tractor meetpoint sign. Tours: ~$40pp."},
        {time:"10:00am", desc:"Ingólfshöfði tractor-wagon tour — puffins + seabirds", note:"The reserve rises from black sands — you cross a tidal flat by tractor-drawn wagon. 2 hrs total."},
        {time:"12:30pm", desc:"Drive east past Höfn to Stafafell (~1.5 hrs from Ingólfshöfði)"},
        {time:"2:00pm", desc:"Check in Stafafell Nature Park campsite", note:"Call ahead: +354 699 6684"},
        {time:"3:00pm", desc:"Lónsöræfi Hvítserkur canyon hike — full afternoon"},
        {time:"7:00pm", desc:"Return to camp. Cook dinner."},
      ],
      hikes:[
        {name:"Lónsöræfi Hvítserkur Canyon", distance:"8–15km", difficulty:"Moderate", gain:"400m", time:"4–5 hrs", desc:"Iceland's most overlooked hiking area — jagged peaks in rust red and orange rhyolite rising from a hidden valley. Virtually zero other visitors. Trail unmarked in sections: download on Gaia GPS before setting off. Water from mountain streams only — bring a filter. Access via mild F985 track."},
      ],
      excursions:[
        {name:"Ingólfshöfði Tractor Tour — Puffin Reserve", operator:"Local family operators", price:"~$40pp", duration:"2 hrs", url:"https://www.ingolfshofdi.com", desc:"Ingólfshöfði rises dramatically from the black sand flats of the southeast coast. Accessible only by tractor-drawn wagon across the tidal flats. Inside the reserve: puffin burrows everywhere, great skuas nesting on the ground, Arctic terns dive-bombing (wear a hat), and extraordinary views of Vatnajökull. Named after Iceland's first settler, Ingólfr Arnarson."}
      ],
      tips:["Ingólfshöfði Arctic terns will dive-bomb your head to protect their nests — hold a stick or trekking pole above your head as you walk. They aim for the highest point.", "Stafafell is the cheapest and most remote camp of the trip — embrace the silence."],
      warnings:[],
      costs:{ accommodation:14, food:18, activities:40 }
    },
    {
      num:9, date:"Jul 8", title:"East Fjords + Borgarfjörður Eystri Puffins + Stuðlagil Canyon",
      sleep:"hostel", accommodation:"East Guesthouse, Egilsstaðir",
      tags:["hostel","hike"], lat:65.2590, lng:-14.3952,
      summary:"Borgarfjörður Eystri — Iceland's most intimate puffin boardwalk (10,000 pairs). Stuðlagil basalt canyon. Seyðisfjörður rainbow road. Resupply Egilsstaðir.",
      schedule:[
        {time:"8:00am", desc:"Drive north from Stafafell on Ring Road — East Fjords coast"},
        {time:"10:30am", desc:"Turn north on Route 94 to Borgarfjörður Eystri (70km, all paved)", note:"Road fully paved since 2023. Mountain pass with incredible views."},
        {time:"11:30am", desc:"Borgarfjörður Eystri — Hafnarhólmi puffin boardwalk", note:"FREE. Wooden platforms put you within 1–2m of nesting puffins. 10,000 pairs. Best close-up puffin experience in Iceland."},
        {time:"1:00pm", desc:"Drive back to Ring Road via Route 94"},
        {time:"2:30pm", desc:"Stuðlagil Canyon — east side rim hike", note:"Route 923 north. Check upstream weather: rain = opaque river, no turquoise."},
        {time:"4:30pm", desc:"Drive over mountain pass to Seyðisfjörður"},
        {time:"5:00pm", desc:"Seyðisfjörður — rainbow road, blue church, café stop"},
        {time:"6:30pm", desc:"Check in East Guesthouse, Egilsstaðir. MAJOR RESUPPLY: Bónus, fuel, camp gas, laundry."},
      ],
      hikes:[
        {name:"Stuðlagil Canyon East Rim", distance:"4–8km RT", difficulty:"Easy–Moderate", gain:"100m", time:"2–4 hrs", desc:"Hexagonal basalt columns rising 30m from a turquoise glacial river — exposed when a dam upstream was built in 2009. One of Iceland's most photogenic spots, still virtually unknown outside Iceland. Go as far as Stuðlafoss waterfall for the best views."},
      ],
      excursions:[],
      tips:["Borgarfjörður Eystri puffins: sit still for a few minutes near the boardwalk edge — the birds will walk up to within arm's length. You can hear their growl-purr from underground burrows beneath your feet.", "Egilsstaðir Bónus is your last cheap supermarket until Akureyri. Fill gas and camp fuel here."],
      warnings:[],
      costs:{ accommodation:45, food:25 }
    },
    {
      num:10, date:"Jul 9", title:"Mývatn — Volcanic Wonderland + Earth Lagoon",
      sleep:"camp", accommodation:"Hlíð Campsite, Lake Mývatn",
      tags:["camp","hike"], lat:65.6495, lng:-16.9187,
      summary:"Goðafoss waterfall. Hverfjall crater rim. Dimmuborgir lava towers. Grjótagjá GoT cave. Earth Lagoon soak.",
      schedule:[
        {time:"8:30am", desc:"Drive Ring Road west (~2.5 hrs, 175km)"},
        {time:"10:00am", desc:"Goðafoss waterfall — quick stop", note:"Free. Right off Ring Road. 5 min walk."},
        {time:"10:30am", desc:"Hverfjall crater rim hike", note:"Parking ~$8. Stay on marked path — tephra surface is permanently damaged by footsteps."},
        {time:"1:00pm", desc:"Dimmuborgir lava formations", note:"Free. 30–90 min."},
        {time:"2:30pm", desc:"Grjótagjá lava cave hot spring", note:"FREE. Game of Thrones cave. Blue glow. Too hot to swim but unmissable."},
        {time:"5:00pm", desc:"Earth Lagoon Mývatn (pre-booked evening slot)", note:"~$64pp. Confirm 2026 reopening at earthlagoon.is."},
        {time:"8:00pm", desc:"Hlíð campsite. HEAD NETS ON. Zip tent immediately."},
      ],
      hikes:[
        {name:"Hverfjall Crater Rim Loop", distance:"3km", difficulty:"Moderate", gain:"150m", time:"2 hrs", desc:"Climb the outer slope of this perfectly circular tephra cone (1km wide). Views over Lake Mývatn, lava fields, and surrounding volcanic highlands. IMPORTANT: stay on marked path — footsteps permanently damage the tephra surface."},
      ],
      excursions:[
        {name:"Earth Lagoon Mývatn", operator:"earthlagoon.is", price:"~$64pp", duration:"2–3 hrs", url:"https://www.earthlagoon.is", desc:"Geothermal lagoon on a hill overlooking Lake Mývatn after 2026 renovation. Milky blue water, steam rooms, multiple pools. Cheaper and less crowded than Blue Lagoon. Book an evening slot to avoid tour-bus rush."}
      ],
      tips:["⚠️ Buy head nets in Egilsstaðir before arriving. Mývatn midges in July are legendary — they fly into your eyes, ears and mouth constantly. Head nets are not optional.", "Grjótagjá hot spring: the water is too hot to swim but the blue glow inside the cave is extraordinary. Worth the short walk from the road."],
      warnings:["MIDGES: Never open the tent without immediately zipping it shut. They will fill the tent in 10 seconds."],
      costs:{ accommodation:16, food:18, activities:64 }
    },
    {
      num:11, date:"Jul 10", title:"Askja Caldera + Viti Crater Swim — F88",
      sleep:"camp", accommodation:"Dreki Hut",
      tags:["camp","hike","froad"], lat:65.0421, lng:-16.5952,
      froad:{ id:"F88_Askja", risk:"low", note:"F88 opens late June on average. By Jul 10 it should have been open for ~2 weeks. Still check road.is morning of." },
      summary:"F88 through the world's largest lava field to Askja caldera. Swim in Viti geothermal crater. Sleep at Dreki hut under midnight sun.",
      schedule:[
        {time:"7:00am", desc:"FILL FUEL TO MAX + 20L jerry can at Mývatn before departure", note:"Zero fuel on F88 route. None."},
        {time:"7:30am", desc:"Register at safetravel.is. Enter F88 (~20km east of Mývatn)"},
        {time:"8:00am", desc:"Drive F88 through Ódáðahraun lava desert to Dreki (~2.5 hrs, 60km)"},
        {time:"10:30am", desc:"Leave truck at Dreki. Begin Askja caldera hike"},
        {time:"11:00am", desc:"Askja caldera hike — 8km RT, 3–4 hrs"},
        {time:"2:30pm", desc:"Swim in Viti geothermal crater — FREE. Warm milky blue water."},
        {time:"4:00pm", desc:"Return to Dreki. Camp. Cook."},
        {time:"2:00am", desc:"Midnight sun in the highlands — sit outside"},
      ],
      hikes:[
        {name:"Askja Caldera + Viti Crater", distance:"8km RT", difficulty:"Moderate", gain:"200m", time:"3–4 hrs", desc:"Follow marked trail from Dreki across ancient lava fields to the rim of the Askja caldera — a vast bowl containing deep blue Lake Öskjuvatn. Viti explosion crater (150m wide, 15 min from the rim) is filled with warm milky blue geothermal water. Swimming inside an active volcanic crater in the highland lava desert is genuinely unlike anything else on Earth."},
      ],
      excursions:[],
      tips:["The F88 drive takes 2.5 hrs each way. The Ódáðahraun lava desert (world's largest) is as dramatic as the caldera itself.", "Dreki hut has snacks, water, and rangers on-site. Indoor dining room closes at 9pm. Rocky ground — sleep in rooftop tent."],
      warnings:["CRITICAL: Fill fuel to maximum + 20L jerry can at Mývatn. Zero fuel on this route.", "Walk every river crossing on F88 before driving through.", "Bring warm layers — altitude makes it significantly colder than the Ring Road."],
      costs:{ accommodation:18, food:20, fuel:98 }
    },
    {
      num:12, date:"Jul 11", title:"Exit F88 → Akureyri Whale Watching",
      sleep:"hostel", accommodation:"Akureyri Guesthouse",
      tags:["hostel","excursion"], lat:65.6814, lng:-18.0898,
      summary:"Drive back out F88. Akureyri: whale watching in Eyjafjörður fjord. Botanical garden. Laundry + resupply.",
      schedule:[
        {time:"8:00am", desc:"Exit F88 (same road back, 2.5 hrs to Ring Road)"},
        {time:"10:30am", desc:"Top up fuel at first Ring Road station"},
        {time:"12:00pm", desc:"Drive Ring Road west to Akureyri (~90 min)"},
        {time:"1:30pm", desc:"Check in Akureyri Guesthouse. Laundry + resupply."},
        {time:"2:00pm", desc:"Whale watching — Akureyri harbour (pre-booked)", note:"~$90pp. 3hrs. whalewatchingakureyri.is"},
        {time:"5:30pm", desc:"Akureyri botanical garden — free"},
        {time:"7:00pm", desc:"Dinner — cook in guesthouse or reindeer burger at Backpackers (~$20pp)"},
      ],
      hikes:[],
      excursions:[
        {name:"Whale Watching — Eyjafjörður Fjord", operator:"Whale Watching Akureyri (whalewatchingakureyri.is)", price:"~$90pp", duration:"3 hrs", url:"https://www.whalewatchingakureyri.is", desc:"Eyjafjörður is Iceland's longest fjord and one of Europe's most reliable whale-watching spots. July = peak humpback and minke season. ~95% sighting success rate. Departs from the city harbour — no transfer needed. Humpbacks regularly breach and bubble-net feed here."}
      ],
      tips:["Great rest day after two intensive highland days. Long shower, full laundry, proper resupply.", "The world's most northerly botanical garden blooms beautifully in July — free and surprisingly remarkable."],
      warnings:[],
      costs:{ accommodation:55, food:26, activities:90 }
    },
    {
      num:13, date:"Jul 12", title:"Kolugljúfur Canyon + Hólar Forest Camp",
      sleep:"camp", accommodation:"Hólar Campground",
      tags:["camp","hike"], lat:65.7371, lng:-19.1196,
      summary:"Kolugljúfur hidden gorge waterfall — one of the best free stops of the entire trip. Hólar ancient cathedral. Sheltered birch forest camp.",
      schedule:[
        {time:"9:00am", desc:"Depart Akureyri west on Ring Road"},
        {time:"10:00am", desc:"CALL Hólar campsite from Akureyri: +354 899 3231", note:"Confirm water is operational — May 2026 review flagged disconnection."},
        {time:"11:30am", desc:"Kolugljúfur canyon — Route 715 south off Ring Road", note:"Free. 30–60 min walk. No guardrails — care near edge."},
        {time:"1:00pm", desc:"Drive south to Hólar í Hjaltadal (~45 min)"},
        {time:"2:00pm", desc:"Explore Hólar cathedral grounds — free"},
        {time:"3:00pm", desc:"Set up camp in birch forest. Cook dinner."},
      ],
      hikes:[
        {name:"Kolugljúfur Canyon Walk", distance:"1–2km", difficulty:"Easy", gain:"50m", time:"30–60 min", desc:"A hidden gorge carved deep into red-orange rock with multiple waterfalls — one shoots water upward in strong wind creating a natural mist wall. Known to almost no tourists outside Iceland. Free parking."},
      ],
      excursions:[],
      tips:["Hólar is Iceland's oldest cathedral village, one-time seat of the bishop. The red sandstone cathedral dates from 1763.", "Deliberately slow day between two intense sections — let the legs recover."],
      warnings:["CALL Hólar campsite (+354 899 3231) before leaving Akureyri. If water still disconnected, backup: Hvammstangi municipal campsite (~50 min west on Ring Road)."],
      costs:{ accommodation:14, food:18 }
    },
    {
      num:14, date:"Jul 13", title:"Snæfellsnes — Kirkjufell + The Freezer",
      sleep:"hostel", accommodation:"The Freezer Hostel, Rif",
      tags:["hostel"], lat:64.9222, lng:-23.8194,
      summary:"Long drive to Snæfellsnes. Ytri Tunga harbor seals. Kirkjufell mountain + Kirkjufellsfoss. Midnight return for golden light.",
      schedule:[
        {time:"8:00am", desc:"Depart Hólar. Drive south then west (~220km, ~3 hrs)"},
        {time:"1:00pm", desc:"Ytri Tunga seal colony beach", note:"FREE. Harbor seals on rocks completely unbothered. Walk to end of boardwalk."},
        {time:"2:00pm", desc:"Kirkjufell mountain + Kirkjufellsfoss waterfall viewpoint", note:"FREE. Iceland's most photographed mountain."},
        {time:"4:30pm", desc:"Check in The Freezer Hostel, Rif", note:"thefreezerhostel.com. Owner Kári plays live guitar evenings."},
        {time:"6:00pm", desc:"Cook dinner in hostel kitchen"},
        {time:"11:30pm", desc:"Drive back to Kirkjufell for midnight sun golden light", note:"10 min from hostel. Mountain glows gold. Bring camera."},
      ],
      hikes:[],
      excursions:[],
      tips:["The midnight light on Kirkjufell is one of the great photographic moments of Iceland. Don't skip the midnight drive back.", "The Freezer is a converted fish-freezing plant. Art on every wall, acoustic music most evenings."],
      warnings:[],
      costs:{ accommodation:45, food:18, fuel:55 }
    },
    {
      num:15, date:"Jul 14", title:"Snæfellsjökull + Seltún → KEF — 4pm Flight",
      sleep:"—", accommodation:"Flight departs 4:00pm",
      tags:["hike"], lat:63.8958, lng:-22.0548,
      summary:"Arnarstapi coastal trail + Gatklettur arch. Snæfellsjökull glacier tip. Seltún geothermal. Return truck KEF. 4pm departure.",
      schedule:[
        {time:"7:30am", desc:"Arnarstapi — coastal trail + Gatklettur arch hike"},
        {time:"9:30am", desc:"Hellnar viewpoint + basalt shore walk"},
        {time:"10:30am", desc:"Drive to Snæfellsjökull NP glacier tip — free"},
        {time:"11:45am", desc:"⚠️ LEAVE Snæfellsnes by 11:45am at the latest"},
        {time:"12:00pm", desc:"Drive south to Reykjanes peninsula (~2hrs)"},
        {time:"2:00pm", desc:"Seltún geothermal area — 30 min boardwalk", note:"FREE. Bubbling mud pots, steaming vents. En route to KEF — adds only 20 min."},
        {time:"1:30pm", desc:"Return truck to KEF rental lot", note:"Allow 2.5hrs before 4pm flight. Target KEF by 1:30pm."},
        {time:"4:00pm", desc:"FLIGHT DEPARTS"},
      ],
      hikes:[
        {name:"Arnarstapi–Hellnar Coastal Trail + Gatklettur", distance:"5km RT", difficulty:"Easy", gain:"50m", time:"1.5 hrs", desc:"Coastal path past basalt sea stacks, sea arches, caves, and seabird colonies. Gatklettur — a natural circular arch through solid rock — is the highlight. Fulmars, kittiwakes, and Arctic terns everywhere."},
      ],
      excursions:[],
      tips:["Duty-free at KEF is genuinely good value for Icelandic spirits, chocolate, and wool items.", "Return truck fully cleaned — rooftop tent folded and latched, truck bed swept."],
      warnings:["FLIGHT DEPARTS 4:00pm. Must return truck by 1:30pm. Leave Snæfellsnes tip by 11:45am — not a minute later."],
      costs:{ food:18 }
    },
  ],

  regions:{
    south:[1,2,3,4,5,6,7],
    east:[7,8,9],
    north:[10,11,12,13],
    west:[13,14,15],
  },

  budget:{
    fixed:[
      {label:"4x4 truck rental — 15 days, F-road insurance", sub:"~$90/day", pp:675, total:1350},
      {label:"Iceland Camping Card — 2 adults, 28 nights", sub:"campingcard.is", pp:94, total:187},
      {label:"Travel insurance — adventure activity coverage", sub:"World Nomads or similar", pp:60, total:120},
    ],
    accommodation:[
      {label:"Hostel nights × 7 (avg $47pp)", sub:"Loft HI, Vík HI, Höfn HI, East GH, Akureyri GH, Freezer", pp:329, total:658},
      {label:"Camp nights × 7 (avg $17pp)", sub:"Landmannalaugar, Þakgil, Blágil, Skaftafell, Stafafell, Hlíð, Dreki", pp:119, total:238},
    ],
    food:[
      {label:"15 days self-catering avg $22/day", sub:"Bónus shops, cook from truck stove", pp:330, total:660},
    ],
    activities:[
      {label:"Glacier Xtreme ice climbing — Falljökull", sub:"adventures.is — BOOK NOW", pp:242, total:484},
      {label:"Canyoning under Vatnajökull", sub:"ice-guardians.com — BOOK NOW", pp:278, total:556},
      {label:"Katla ice cave super-jeep", sub:"troll.is / katlatrack.is", pp:90, total:180},
      {label:"Whale watching — Akureyri", sub:"whalewatchingakureyri.is", pp:90, total:180},
      {label:"Earth Lagoon Mývatn", sub:"earthlagoon.is — confirm 2026 reopening", pp:64, total:128},
      {label:"Ingólfshöfði puffin tractor tour", sub:"ingolfshofdi.com", pp:40, total:80},
      {label:"Þórsmörk Sterna bus return", sub:"sterna.is — non-optional access", pp:44, total:88},
      {label:"Hallgrímskirkja tower", sub:"Day 1", pp:11, total:22},
    ],
    fuel:[
      {leg:"Day 1: KEF → Reykjavík + errands", km:80, cost:10},
      {leg:"Day 2: Reykjavík → Háifoss → Landmannalaugar F208", km:210, cost:26},
      {leg:"Day 3: Landmannalaugar → Þórsmörk area → Þakgil", km:60, cost:8},
      {leg:"Day 4: Þakgil → Vík area (Dyrhólaey, Reynisfjara)", km:70, cost:9},
      {leg:"Day 5: Vík → Fjáðrárgljúfur → F206/F207 Laki → Blágil", km:200, cost:35},
      {leg:"Day 6: Blágil → Skaftafell", km:80, cost:10},
      {leg:"Day 7: Skaftafell → Haukafell canyoning → Höfn", km:100, cost:12},
      {leg:"Day 8: Höfn → Ingólfshöfði → Stafafell", km:130, cost:16},
      {leg:"Day 9: Stafafell → Borgarfjörður Eystri → Stuðlagil → Seyðisfjörður → Egilsstaðir", km:260, cost:33},
      {leg:"Day 10: Egilsstaðir → Mývatn", km:175, cost:22},
      {leg:"Day 11: Mývatn → F88 → Askja → Dreki (highland, slow)", km:260, cost:49},
      {leg:"Day 12: Dreki → F88 exit → Akureyri", km:200, cost:25},
      {leg:"Day 13: Akureyri → Kolugljúfur → Hólar", km:100, cost:13},
      {leg:"Day 14: Hólar → Snæfellsnes (long drive)", km:220, cost:28},
      {leg:"Day 15: Snæfellsnes → Reykjanes → KEF", km:200, cost:25},
    ],
    parking:[
      {site:"Háifoss (Road 332)", cost:8},
      {site:"Seljalandsfoss + Skógafoss", cost:8},
      {site:"Skaftafell NP (Day 6)", cost:4},
      {site:"Dyrhólaey + Reynisfjara", cost:8},
      {site:"Jökulsárlón (Diamond Beach stop)", cost:4},
      {site:"Fjáðrárgljúfur canyon", cost:4},
      {site:"Hverfjall, Mývatn", cost:4},
      {site:"Stuðlagil Canyon", cost:4},
      {site:"Snæfellsjökull NP + Arnarstapi", cost:8},
      {site:"Seltún, Reykjanes", cost:3},
      {site:"Misc Ring Road pullouts", cost:8},
    ],
  },

  checklist:[
    {
      section:"Book immediately — do today",
      badge:"urgent",
      items:[
        {text:"Glacier Xtreme ice climbing — Falljökull", sub:"Day 6 (Jul 5) · ~$242pp · Max 6 people — sells out in days", url:"https://adventures.is/iceland/day-tours/glacier-tours/glacier-tours-on-vatnajokull/glacier-xtreme-and-ice-climbing/"},
        {text:"Canyoning under Vatnajökull — Ice Guardians", sub:"Day 7 (Jul 6) · ~$278pp (34,900 ISK) · Only operator in Iceland", url:"https://ice-guardians.com/tour/half-day-canyoning-under-vatnajokull/"},
        {text:"Katla ice cave super-jeep tour", sub:"Day 4 (Jul 3) · ~$90pp · Departs from Vík", url:"https://www.troll.is"},
        {text:"Whale watching — Akureyri", sub:"Day 12 (Jul 11) · ~$90pp · 3hrs", url:"https://www.whalewatchingakureyri.is"},
        {text:"Loft HI Hostel, Reykjavík", sub:"Night 1 (Jun 30)", url:"https://www.hostel.is"},
        {text:"Þórsmörk Sterna bus return", sub:"Day 3 (Jul 2) · $44pp · Must pre-book", url:"https://www.sterna.is"},
        {text:"Vík HI Hostel", sub:"Night 4 (Jul 3)", url:"https://www.hostel.is"},
        {text:"Höfn HI Hostel", sub:"Night 7 (Jul 6)", url:"https://www.hostel.is"},
        {text:"Þakgil canyon campsite", sub:"Night 3 (Jul 2) · +354 893 4889", url:"https://www.thakgil.is"},
      ]
    },
    {
      section:"Book within 1–2 weeks",
      badge:"soon",
      items:[
        {text:"Earth Lagoon Mývatn — confirm 2026 reopening first", sub:"Day 10 (Jul 9) · ~$64pp", url:"https://www.earthlagoon.is"},
        {text:"Ingólfshöfði tractor puffin tour", sub:"Day 8 (Jul 7) · ~$40pp", url:"https://www.ingolfshofdi.com"},
        {text:"East Guesthouse, Egilsstaðir", sub:"Night 9 (Jul 8)", url:"https://www.eastguesthouse.is"},
        {text:"Akureyri Guesthouse", sub:"Night 12 (Jul 11) · book via Booking.com"},
        {text:"The Freezer Hostel, Rif", sub:"Night 14 (Jul 13)", url:"https://www.thefreezerhostel.com"},
        {text:"Landmannalaugar parking reservation", sub:"Required 9am–4pm arrivals · fi.is", url:"https://www.fi.is/en/mountain-huts/all-mountain-huts/landmannalaugar"},
      ]
    },
    {
      section:"Purchase before departure",
      badge:"before",
      items:[
        {text:"Iceland Camping Card — 2 adults, 28 nights", sub:"€179 / ~$187", url:"https://www.campingcard.is"},
        {text:"Travel insurance — adventure activity coverage", sub:"~$60pp"},
        {text:"Head nets × 2", sub:"Essential for Mývatn — absolutely non-optional"},
        {text:"Water filter (Sawyer Squeeze)", sub:"For Lónsöræfi and Askja trail days"},
        {text:"Blackout sleep mask × 2", sub:"Midnight sun never gets dark in July"},
        {text:"20L fuel jerry can", sub:"For F88 Askja day — fill at Mývatn"},
      ]
    },
    {
      section:"Bookmark + download before departure",
      badge:"before",
      items:[
        {text:"Parka.is app", sub:"Camera-enforced parking at ALL major Iceland sites", url:"https://parka.is"},
        {text:"112 Iceland app", sub:"One button sends GPS to emergency services"},
        {text:"Gaia GPS — download Iceland offline maps", sub:"Covers all F-roads. Download before leaving."},
        {text:"Bookmark umferdin.is/en/road/91381", sub:"Live F207 Laki road status — check morning of Day 5", url:"https://umferdin.is/en/road/91381"},
        {text:"Bookmark road.is", sub:"General F-road conditions and closures"},
        {text:"Bookmark safetravel.is", sub:"Register F88 and F206 routes before entering"},
        {text:"Bookmark vegagerdin.is mountain road page", sub:"Official IRCA road opening data", url:"https://www.vegagerdin.is/en/the-transportation-system/the-road-system/roads/opening-of-mountain-roads"},
      ]
    },
    {
      section:"Call / confirm before departure",
      badge:"before",
      items:[
        {text:"Rental company — F-road insurance in writing", sub:"Confirm F88, F206/F207 covered. Full-size spare tire."},
        {text:"Hólar campsite water status", sub:"Call +354 899 3231 — May 2026 review flagged disconnection"},
        {text:"Stafafell campsite open Jul 7", sub:"Call +354 699 6684"},
        {text:"Laki F207 road open for Jul 4", sub:"Check umferdin.is/en/road/91381 week of departure"},
      ]
    },
    {
      section:"Clothing + gear",
      badge:"gear",
      items:[
        {text:"Waterproof jacket + waterproof trousers × each", sub:"Keep in truck cab at ALL times — not the truck bed"},
        {text:"Merino wool base layers × 3 sets each"},
        {text:"Warm mid-layer (fleece or down puffy) × each"},
        {text:"Warm hat + gloves × each", sub:"Highlands get cold even in July"},
        {text:"Stiff hiking boots with ankle support × each", sub:"Break them in before you go"},
        {text:"Dry bags for everything in truck bed"},
        {text:"Camp stove + gas canisters", sub:"Buy gas in Iceland — cannot fly with canisters"},
        {text:"Cooking pot, pan, utensils, plates, cups"},
        {text:"Power banks × 2"},
        {text:"Tow rope + tire plug kit", sub:"F-road non-negotiable"},
        {text:"First aid kit"},
        {text:"Sunscreen", sub:"Midnight sun = real UV even at 11pm"},
      ]
    },
  ],
};
