const toggleMenu = () => {
  const menu = document.getElementsByClassName("menu")[0];
  const app = document.getElementsByClassName("app")[0];
  const menu_btn = document.getElementsByClassName("btn-menu")[0];
  const menu_items = document.getElementsByClassName("menu-item");
  const header = document.getElementsByClassName("header")[0];
  if (document.querySelector(".question")) {
    document.querySelector(".question-title").style.display = "none";
    document.querySelector(".question-title").classList.toggle("display_none");
    document.querySelector(".question").classList.toggle("display_none");
  }
  menu.classList.toggle("open");
  menu_btn.classList.toggle("right");
  app.classList.toggle("disabledScroll");
  header.classList.toggle("background");
  for (let i = 0; i < menu_items.length; i++) {
    menu_items[i].classList.toggle("opened");
  }
};
const clickLink = (e) => {
  const links = document.getElementsByClassName("menu_link");
  for (let i = 0; i < links.length; i++) {
    links[i].classList.remove("active");
  }
  e.target.classList.add("active");
  if (
    document.querySelector(".question") ||
    document.querySelector(".load") ||
    document.querySelector(".end")
  ) {
    document.querySelector(".question").innerHTML = "";
    document.querySelector(".question-title").innerHTML = "";
    document.querySelector(".question-title").remove();
    document.querySelector(".question").remove();
    document.querySelector(".intro").classList.remove("display_none");
    document.querySelector(".quotes").classList.remove("display_none");
    document.querySelector(".results").classList.remove("display_none");
    document.querySelector(".time").classList.remove("display_none");
  }
  toggleMenu();
  document.querySelector(".app").classList.remove("disabledScroll");
};

const app = document.getElementsByClassName("app")[0];

const createQuestionPage = () => {
  document.querySelector(".intro").classList.toggle("display_none");
  document.querySelector(".quotes").classList.toggle("display_none");
  document.querySelector(".results").classList.toggle("display_none");
  document.querySelector(".time").classList.toggle("display_none");
  const links = document.getElementsByClassName("menu_link");
  for (let i = 0; i < links.length; i++) {
    links[i].classList.remove("active");
  }
  links[2].classList.add("active");
  const question_page = document.createElement("div");
  question_page.classList.add("question");
  app.appendChild(question_page);
  const header = document.querySelector("header");
  app.classList.add("disabledScroll");
  const title = document.createElement("p");
  title.classList.add("question-title");
  title.innerHTML = "тест на определение IQ";
  header.appendChild(title);
  const indicator = document.createElement("div");
  const indicator_green = document.createElement("div");
  indicator.classList.add("question-indicator");
  indicator_green.classList.add("question-green");
  indicator_green.style.width = "0%";
  question_page.appendChild(indicator);
  indicator.appendChild(indicator_green);
  const btn = document.createElement("button");
  btn.classList.add("question-btn");
  btn.innerHTML = "далее";
  question_page.appendChild(btn);

  fetch("https://643e9555c72fda4a0bfaf03c.mockapi.io/questions")
    .then((response) => response.json())
    .then((json) => {
      let i = 0;
      let pixels = (260 / json.length).toFixed(2);
      question = Object.keys(json[i])[0];
      variants = Object.values(json[i])[0];
      type = Object.values(json[i])[0].splice(-1)[0].toString();
      indicator_green.style.width = `${pixels * (i + 1)}px`;
      generateRadioQuestion(question, variants);
      btn.addEventListener("click", () => {
        i++;
        if (btn.classList.contains("checked_variant") && i < json.length) {
          type = Object.values(json[i])[0].splice(-1)[0].toString();
          question = Object.keys(json[i])[0];
          variants = Object.values(json[i])[0];
          indicator_green.style.width = `${pixels * (i + 1)}px`;
          btn.classList.remove("checked_variant");
          switch (type) {
            case "radio":
              generateRadioQuestion(question, variants);
              break;
            case "color":
              generateColorQuestion(question, variants);
              break;
            case "img":
              generateImgQuestion(question, variants);
              break;
            case "radio, img":
              generateRadioQuestion(question, variants.slice(1));
              const img = document.createElement("img");
              img.src = variants[0];
              img.style.marginBottom = `${19}px`;
              document.querySelector(".question-text").after(img);
              break;
            default:
              console.log(`${i}/${json.length}: ${type}. ${question}`);
              clearQuestionPage();
              btn.classList.add("checked_variant");
              btn.click();
          }
        } else if (i === json.length) {
          console.log("END!");
          window.setTimeout(() => {
            createLoad();
          }, 50);
          window.setTimeout(() => {
            createEndResults();
          }, 1000);
        }
      });
    });
};

const clearQuestionPage = () => {
  const question_page = document.querySelector(".question");
  let text_question =
    document.querySelector(".question-text") || document.createElement("div");
  text_question.classList.add("question-text");
  text_question.innerHTML = " ";
  const questions_card =
    document.querySelector(".questions-card") || document.createElement("div");
  questions_card.innerHTML = "";
  questions_card.classList.add("questions-card");
  question_page.appendChild(questions_card);
};

const createLoad = () => {
  clearQuestionPage();
  const question_page = document.querySelector(".question");
  const links = document.querySelector(".menu_link");
  for (let i = 0; i < links.length; i++) {
    links[i].classList.remove("active");
  }
  document.querySelector(".question-btn").remove();
  const title = document.createElement("div");
  title.classList.add("load-title");
  title.innerHTML = "обработка результатов";
  const text = document.createElement("div");
  text.classList.add("load-text");
  text.innerHTML = "Определение стиля мышления";
  const img = document.createElement("img");
  img.classList.add("load-img");
  img.src = "images/load.svg";
  question_page.appendChild(title);
  question_page.appendChild(img);
  question_page.appendChild(text);
  dotes = document.createElement("div");
  dotes.classList.add("dotted");
  question_page.appendChild(dotes);
  window.setTimeout(function () {
    img.classList.add("animate-loading");
  }, 50);
};

const createEndResults = () => {
  clearQuestionPage();
  const title = document.querySelector(".question-title");
  title.innerHTML = "Готово!";
  title.style.fontSize = `${20}px`;
  title.style.margin = "0 auto";
  const question_page = document.querySelector(".question");
  console.log(question_page);
  question_page.innerHTML = "";
  const end_title = document.createElement("div");
  end_title.classList.add("end-title");
  end_title.innerHTML = "Ваш результат рассчитан:";
  const end_text = document.createElement("div");
  end_text.classList.add("end-text");
  end_text.innerHTML =
    "<span> вы относитесь к 3%</span> респондентов, чей уровень интеллекта более чем на 15 пунктов отличается от среднего в большую или меньшую сторону! ";
  const end_big = document.createElement("div");
  end_big.classList.add("end-big");
  end_big.innerHTML = "Скорее получите свой результат!";
  const end_card = document.createElement("div");
  end_card.classList.add("end-card");
  end_card.innerHTML =
    "В целях защиты персональных данных результат теста, их подробная интерпретация и рекомендации доступны в виде голосового сообщения по звонку с вашего мобильного телефона ";
  const end_small = document.createElement("div");
  end_small.classList.add("end-small");
  end_small.innerHTML = `Звоните скорее, запись доступна всего <span>${10}:${00}</span> МИНУТ`;
  const btn = document.createElement("button");
  btn.classList.add("end-btn");
  const phone = document.createElement("img");
  phone.classList.add("end-phone");
  phone.src = "./images/phone.svg";
  btn.innerHTML = "позвонить и прослушать результат ";
  btn.appendChild(phone);
  const footer = document.createElement("div");
  footer.classList.add("end-footer");
  footer.innerHTML =
    "TERMENI SI CONDITII: ACESTA ESTE UN SERVICIU DE DIVERTISMENT. PRIN FOLOSIREA LUI DECLARATI CA AVETI 18 ANI IMPLINITI, ";
  question_page.appendChild(end_title);
  question_page.appendChild(end_text);
  question_page.appendChild(end_big);
  question_page.appendChild(end_card);
  question_page.appendChild(end_small);
  question_page.appendChild(btn);
  question_page.appendChild(footer);
};

const generateImgQuestion = (question, variants) => {
  clearQuestionPage();
  const questions_card = document.querySelector(".questions-card");
  const btn = document.querySelector(".question-btn");
  let text_question =
    document.querySelector(".question-text") || document.createElement("div");
  text_question.classList.add("question-text");
  text_question.innerHTML = question;
  questions_card.appendChild(text_question);
  let question_card = document.createElement("div");
  question_card.classList.add("question-card-img");
  let img = document.createElement("img");
  let path = variants.shift();
  img.src = path;
  questions_card.appendChild(question_card);
  question_card.appendChild(img);
  for (let i = 0; i < variants.length; i++) {
    question_card = document.createElement("div");
    question_card.classList.add("question-card-num");
    question_card.innerHTML = variants[i];
    question_card.addEventListener("click", (e) => {
      let clicked = document.querySelectorAll(".checked_card-num");
      btn.classList.add("checked_variant");
      for (let j = 0; j < clicked.length; j++) {
        clicked[j].classList.remove("checked_card-num");
      }
      e.target.classList.add("checked_card-num");
    });
    questions_card.appendChild(question_card);
  }
};

const generateColorQuestion = (question, variants) => {
  clearQuestionPage();
  const questions_card = document.querySelector(".questions-card");
  const btn = document.querySelector(".question-btn");
  const colors_card = document.createElement("div");
  colors_card.classList.add("questions-card-color");
  questions_card.appendChild(colors_card);
  let text_question =
    document.querySelector(".question-text") || document.createElement("div");
  text_question.classList.add("question-text");
  text_question.innerHTML = question;
  questions_card.appendChild(text_question);
  for (let i = 0; i < variants.length; i++) {
    let question_card = document.createElement("div");
    question_card.classList.add("question-card-color");
    question_card.style.backgroundColor = variants[i];
    question_card.addEventListener("click", () => {
      let clicked = document.querySelectorAll(".checked_card-color");
      btn.classList.add("checked_variant");
      for (let j = 0; j < clicked.length; j++) {
        clicked[j].classList.remove("checked_card-color");
      }
      question_card.classList.add("checked_card-color");
    });
    colors_card.appendChild(question_card);
  }
};

const generateRadioQuestion = (question, variants) => {
  clearQuestionPage();
  const questions_card = document.querySelector(".questions-card");
  let text_question =
    document.querySelector(".question-text") || document.createElement("div");
  text_question.classList.add("question-text");
  text_question.innerHTML = question;
  questions_card.appendChild(text_question);
  const btn = document.querySelector(".question-btn");
  for (let i = 0; i < variants.length; i++) {
    let question_card = document.createElement("div");
    question_card.classList.add("question-card");
    questions_card.appendChild(question_card);
    let radio = document.createElement("input");
    radio.type = "radio";
    radio.classList.add("question-radio");
    radio.setAttribute("id", `${i}`);
    radio.setAttribute("value", `${variants[i]}`);
    radio.setAttribute("name", `${question}`);
    radio.addEventListener("change", () => {
      btn.classList.add("checked_variant");
      q = document.getElementsByClassName("checked_card");
      for (let j = 0; j < q.length; j++) {
        q[j].classList.remove("checked_card");
      }
      question_card.classList.add("checked_card");
    });
    let label = document.createElement("label");
    label.classList.add("question-label");
    label.setAttribute("for", `${i}`);
    label.innerHTML = `${variants[i]}`;
    question_card.appendChild(radio);
    question_card.appendChild(label);
  }
};

const createHeader = () => {
  const header = document.createElement("header");
  header.classList.add("header");
  app.appendChild(header);
  const btn_menu = document.createElement("a");
  btn_menu.classList.add("btn-menu");
  btn_menu.onclick = () => {
    toggleMenu();
  };
  header.appendChild(btn_menu);
  const menu = document.createElement("div");
  menu.classList.add("intro-menu");
  btn_menu.appendChild(menu);
  for (let i = 0; i < 3; i++) {
    let menu_item = document.createElement("div");
    menu_item.classList.add("menu-item");
    menu.appendChild(menu_item);
  }
};

const createIntro = () => {
  const intro = document.createElement("div");
  intro.classList.add("intro");
  intro.setAttribute("id", "main");
  app.appendChild(intro);
  const main = document.createElement("main");
  main.classList.add("intro-main");
  intro.appendChild(main);
  const up = document.createElement("div");
  up.classList.add("intro-up");
  main.appendChild(up);
  const down = document.createElement("div");
  main.appendChild(down);
  down.classList.add("intro-down");
  const suptitle = document.createElement("h2");
  suptitle.classList.add("intro-suptitle");
  suptitle.innerHTML = "Пройдите точный и быстрый <br> <br>";
  up.appendChild(suptitle);
  const title = document.createElement("h1");
  title.classList.add("intro-title");
  title.innerHTML = "тест на <br> определение <br> IQ";
  up.appendChild(title);
  const btn_yellow = document.createElement("button");
  btn_yellow.classList.add("btn");
  btn_yellow.classList.add("btn_yellow");
  btn_yellow.innerHTML = "пРойти тест";
  btn_yellow.onclick = () => {
    createQuestionPage();
  };
  down.appendChild(btn_yellow);
  const text = document.createElement("p");
  text.classList.add("intro-text");
  text.innerHTML =
    "<span> и получите рекомендации <br> по развитию своего интеллекта <br> </span> и улучшению финансового благосостояния и личной жизни";
  down.appendChild(text);
  const btn_more = document.createElement("div");
  down.appendChild(btn_more);
  const btn_white = document.createElement("button");
  btn_white.innerHTML = "&#8593";
  btn_white.onclick = () => {
    document.querySelector("#about").scrollIntoView();
  };
  const btn_down = document.createElement("p");
  btn_down.innerHTML = "подробнее";
  btn_white.classList.add("intro-btn_white");
  btn_down.classList.add("intro-btn_down");
  btn_more.appendChild(btn_white);
  btn_more.appendChild(btn_down);
};

const createQuotes = () => {
  const quotes = document.createElement("div");
  quotes.classList.add("quotes");
  quotes.setAttribute("id", "about");
  app.appendChild(quotes);
  const text = document.createElement("p");
  text.classList.add("quotes-text");
  text.innerHTML =
    "Профессиональный <br> IQ-тест позволяет не <br> только определить коэффициент вашего <br> интеллекта, <br> но и выработать список <br> рекомендаций для <br> повышения этого <br> показателя. ";
  quotes.appendChild(text);
};

const createResults = () => {
  const results = document.createElement("div");
  results.classList.add("results");
  app.appendChild(results);
  const text = document.createElement("p");
  text.classList.add("results-text");
  text.innerHTML =
    "Также по результатам теста <br> <span> вы получите </span> подробные <br> <span> советы </span> по определению наиболее <br> перспективной <span> для вашего <br> типа </span> <b> интеллекта </b> <span> сферы <br> деятельности </span>, <br> которая принесет вам скорейший <br> финансовый результат.";
  results.appendChild(text);
  const btn = document.createElement("button");
  btn.classList.add("btn");
  btn.classList.add("btn_yellow");
  btn.onclick = () => {
    createQuestionPage();
  };
  btn.innerHTML = "пРойти тест";
  results.appendChild(btn);
};

const createTime = () => {
  const time = document.createElement("div");
  time.classList.add("time");
  app.appendChild(time);
  const text = document.createElement("p");
  text.classList.add("time-text");
  text.innerHTML =
    "Прохождение теста займет у <br> вас не более <span> 12 минут </span>, а его <br> результаты вы сможете <br> <span> использовать всю жизнь.</span>";
  time.appendChild(text);
  const card = document.createElement("div");
  card.classList.add("time-card");
  card.innerHTML =
    "Профессиональная <br> интерпретация и детально <b> <br> проработанные <br> рекомендации </b> позволят вам <br> качественно <b> изменить все <br> аспекты своей жизни: </b> от <br> финансового до любовного.";
  time.appendChild(card);
  const btn = document.createElement("button");
  btn.classList.add("btn");
  btn.classList.add("btn_transparent");
  btn.onclick = () => {
    createQuestionPage();
  };
  btn.innerHTML = "пРойти тест";
  time.appendChild(btn);
  const year = document.createElement("div");
  year.classList.add("time-year");
  year.innerHTML = "&#169 2019";
  time.appendChild(year);
};

const createMenu = () => {
  const menu_items = {
    Главная: "#main",
    "Информация о тесте": "#about",
    "пройти тест": "javascript: createQuestionPage()",
  };
  const menu = document.createElement("div");
  menu.classList.add("menu");
  app.appendChild(menu);
  const menuItems = document.createElement("ul");
  menuItems.classList.add("menu-items");
  menu.appendChild(menuItems);
  for (const [key, value] of Object.entries(menu_items)) {
    let item = document.createElement("li");
    item.classList.add("menu_item");
    let link = document.createElement("a");
    link.classList.add("menu_link");
    link.innerHTML = key;
    link.href = value;
    link.onclick = (e) => {
      clickLink(e);
    };
    item.appendChild(link);
    menuItems.appendChild(item);
  }
};
createHeader();
createIntro();
createQuotes();
createResults();
createTime();
createMenu();
