import _extends from '@babel/runtime/helpers/extends';
import React, { useRef, useState, useCallback, useEffect, useContext, useMemo, useReducer, useImperativeHandle, useLayoutEffect, PureComponent } from 'react';
import { StreamChat, Channel as Channel$2, logChatPromiseExecution } from 'stream-chat';
import Dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import emojiRegex from 'emoji-regex';
import RootReactMarkdown from 'react-markdown';
import ReactMarkdown from 'react-markdown/with-html';
import { find } from 'linkifyjs';
import _regeneratorRuntime from '@babel/runtime/regenerator';
import _asyncToGenerator from '@babel/runtime/helpers/asyncToGenerator';
import _classCallCheck from '@babel/runtime/helpers/classCallCheck';
import _createClass from '@babel/runtime/helpers/createClass';
import _defineProperty from '@babel/runtime/helpers/defineProperty';
import i18n from 'i18next';
import calendar from 'dayjs/plugin/calendar';
import updateLocale from 'dayjs/plugin/updateLocale';
import localeData from 'dayjs/plugin/localeData';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/nl';
import 'dayjs/locale/ru';
import 'dayjs/locale/tr';
import 'dayjs/locale/fr';
import 'dayjs/locale/hi';
import 'dayjs/locale/it';
import 'dayjs/locale/en';
import _toConsumableArray from '@babel/runtime/helpers/toConsumableArray';
import _objectWithoutProperties from '@babel/runtime/helpers/objectWithoutProperties';
import DefaultMedia from 'react-player';
import PropTypes from 'prop-types';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import { sanitizeUrl } from '@braintree/sanitize-url';
import { FileIcon, dataTransferItemsToFiles, dataTransferItemsHaveFiles, ImagePreviewer, FilePreviewer, ImageDropzone, FileUploadButton, LoadingIndicator as LoadingIndicator$1 } from 'react-file-utils';
import prettybytes from 'pretty-bytes';
import Carousel, { ModalGateway, Modal as Modal$1 } from 'react-images';
import _assertThisInitialized from '@babel/runtime/helpers/assertThisInitialized';
import _inherits from '@babel/runtime/helpers/inherits';
import _possibleConstructorReturn from '@babel/runtime/helpers/possibleConstructorReturn';
import _getPrototypeOf from '@babel/runtime/helpers/getPrototypeOf';
import Textarea from 'react-textarea-autosize';
import getCaretCoordinates from 'textarea-caret';
import CustomEvent from 'custom-event';
import { isValidElementType } from 'react-is';
import DefaultEmoji from 'emoji-mart/dist/components/emoji/nimble-emoji.js';
import DefaultEmojiIndex from 'emoji-mart/dist/utils/emoji-index/nimble-emoji-index.js';
import DefaultEmojiPicker from 'emoji-mart/dist/components/picker/nimble-picker.js';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import { v4 } from 'uuid';
import { MML as MML$1 } from 'mml-react';
import deepequal from 'react-fast-compare';
import uniqBy from 'lodash.uniqby';
import isEqual from 'lodash.isequal';
import { Virtuoso } from 'react-virtuoso';

/**
 * @typedef {import('../types').ChatContextValue} ChatContextProps
 */

var ChatContext = /*#__PURE__*/React.createContext(
/** @type {ChatContextProps} */
{
  client: new StreamChat(''),
  setActiveChannel: function setActiveChannel() {
    return null;
  }
});
/**
 * @function
 * @template P
 * @param {React.ComponentType<P>} OriginalComponent
 * @returns {React.ComponentType<Exclude<P, ChatContextProps>>}
 */

function withChatContext(OriginalComponent) {
  /** @param {Exclude<P, ChatContextProps>} props */
  var ContextAwareComponent = function ContextComponent(props) {
    return /*#__PURE__*/React.createElement(ChatContext.Consumer, null, function (context) {
      return /*#__PURE__*/React.createElement(OriginalComponent, _extends({}, context, props));
    });
  };

  ContextAwareComponent.displayName = (OriginalComponent.displayName || OriginalComponent.name || 'Component').replace('Base', '');
  return ContextAwareComponent;
}

/**
 * @typedef {import('../types').ChannelContextValue} ChannelContextProps
 */

var ChannelContext = /*#__PURE__*/React.createContext(
/** @type {ChannelContextProps} */
{});
/**
 * @function
 * @template P
 * @param { React.ComponentType<P> } OriginalComponent
 * @returns {React.ComponentType<Exclude<P, ChannelContextProps>>}
 */

function withChannelContext(OriginalComponent) {
  /** @param {Exclude<P, ChannelContextProps>} props */
  var ContextAwareComponent = function ContextComponent(props) {
    return /*#__PURE__*/React.createElement(ChannelContext.Consumer, null, function (context) {
      return /*#__PURE__*/React.createElement(OriginalComponent, _extends({}, context, props));
    });
  };

  ContextAwareComponent.displayName = (OriginalComponent.displayName || OriginalComponent.name || 'Component').replace('Base', '');
  return ContextAwareComponent;
}

Dayjs.extend(LocalizedFormat);
/**
 * @typedef {Required<import('../types').TranslationContextValue>} TranslationContextProps
 */

var TranslationContext = /*#__PURE__*/React.createContext(
/** @type {TranslationContextProps} */
{
  t:
  /** @param {string} key */
  function t(key) {
    return key;
  },
  tDateTimeParser: function tDateTimeParser(input) {
    return Dayjs(input);
  }
});
/**
 * @function
 * @template P
 * @param {React.ComponentType<P>} OriginalComponent
 * @returns {React.ComponentType<Exclude<P, TranslationContextProps>>}
 */

function withTranslationContext(OriginalComponent) {
  /** @param {Exclude<P, TranslationContextProps>} props */
  var ContextAwareComponent = function ContextComponent(props) {
    return /*#__PURE__*/React.createElement(TranslationContext.Consumer, null, function (context) {
      return /*#__PURE__*/React.createElement(OriginalComponent, _extends({}, context, props));
    });
  };

  ContextAwareComponent.displayName = (OriginalComponent.displayName || OriginalComponent.name || 'Component').replace('Base', '');
  return ContextAwareComponent;
}

// @ts-check
/** @type {(text: string | undefined) => boolean} */

var isOnlyEmojis = function isOnlyEmojis(text) {
  if (!text) return false;
  var noEmojis = text.replace(emojiRegex(), '');
  var noSpace = noEmojis.replace(/[\s\n]/gm, '');
  return !noSpace;
};
/** @type {(thing: any) => boolean} */

var isPromise = function isPromise(thing) {
  return typeof (thing === null || thing === void 0 ? void 0 : thing.then) === 'function';
};
/**
 * @typedef {{created_at: number}} Datelike
 * @type {(a: Datelike, b: Datelike) => number}
 **/

var byDate = function byDate(a, b) {
  return a.created_at - b.created_at;
};
/** @type {import('react-markdown').NodeType[]} */

var allowedMarkups = ['html', // @ts-expect-error
'root', 'text', 'break', 'paragraph', 'emphasis', 'strong', 'link', 'list', 'listItem', 'code', 'inlineCode', 'blockquote', 'delete'];
/** @type {(message: string) => (string|null)[]} */

var matchMarkdownLinks = function matchMarkdownLinks(message) {
  var regexMdLinks = /\[([^\[]+)\](\(.*\))/gm;
  var matches = message.match(regexMdLinks);
  var singleMatch = /\[([^\[]+)\]\((.*)\)/;
  var links = matches ? matches.map(function (match) {
    var i = singleMatch.exec(match);
    return i && i[2];
  }) : [];
  return links;
};
/** @type {(message: string) => (string|null)[]} */


var messageCodeBlocks = function messageCodeBlocks(message) {
  var codeRegex = /```[a-z]*\n[\s\S]*?\n```|`[a-z]*[\s\S]*?`/gm;
  var matches = message.match(codeRegex);
  return matches || [];
};
/** @type {(input: string, length: number) => string} */


var truncate = function truncate(input, length) {
  var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '...';

  if (input.length > length) {
    return "".concat(input.substring(0, length - end.length)).concat(end);
  }

  return input;
};
var markDownRenderers = {
  /** @param {{ href: string | undefined; children: React.ReactElement; }} props   */
  link: function link(props) {
    if (!props.href || !props.href.startsWith('http') && !props.href.startsWith('mailto:')) {
      return props.children;
    }

    return /*#__PURE__*/React.createElement("a", {
      href: props.href,
      target: "_blank",
      rel: "nofollow noreferrer noopener"
    }, props.children);
  }
};
/** @type {(input: string | undefined, mentioned_users: import('stream-chat').UserResponse[] | undefined) => React.ReactNode} */

var renderText = function renderText(text, mentioned_users) {
  // take the @ mentions and turn them into markdown?
  // translate links
  if (!text) return null;
  var newText = text;
  var markdownLinks = matchMarkdownLinks(newText);
  var codeBlocks = messageCodeBlocks(newText);
  var detectHttp = /(http(s?):\/\/)?(www\.)?/; // extract all valid links/emails within text and replace it with proper markup

  find(newText).forEach(function (_ref) {
    var type = _ref.type,
        href = _ref.href,
        value = _ref.value;
    var linkIsInBlock = codeBlocks.some(function (block) {
      return block === null || block === void 0 ? void 0 : block.includes(value);
    }); // check if message is already  markdown

    var noParsingNeeded = markdownLinks && markdownLinks.filter(function (text) {
      var strippedHref = href === null || href === void 0 ? void 0 : href.replace(detectHttp, '');
      var strippedText = text === null || text === void 0 ? void 0 : text.replace(detectHttp, '');
      if (!strippedHref || !strippedText) return false;
      return strippedHref.includes(strippedText) || strippedText.includes(strippedHref);
    });
    if (noParsingNeeded.length > 0 || linkIsInBlock) return;
    var displayLink = type === 'email' ? value : truncate(value.replace(detectHttp, ''), 20);
    newText = newText.replace(value, "[".concat(displayLink, "](").concat(encodeURI(href), ")"));
  });

  if (mentioned_users && mentioned_users.length) {
    for (var i = 0; i < mentioned_users.length; i++) {
      var username = mentioned_users[i].name || mentioned_users[i].id;

      if (username) {
        username = escapeRegExp(username);
      }

      var mkdown = "**@".concat(username, "**");
      var re = new RegExp("@".concat(username), 'g');
      newText = newText.replace(re, mkdown);
    }
  }

  return /*#__PURE__*/React.createElement(ReactMarkdown, {
    allowedTypes: allowedMarkups,
    source: newText,
    renderers: markDownRenderers,
    escapeHtml: true,
    unwrapDisallowed: true,
    transformLinkUri: function transformLinkUri(uri) {
      return uri.startsWith('app://') ? uri : RootReactMarkdown.uriTransformer(uri);
    }
  });
};
/** @param { string } text */

function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&');
} // https://stackoverflow.com/a/6860916/2570866


function generateRandomId() {
  // prettier-ignore
  return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
}

function S4() {
  return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
} // @ts-expect-error


var smartRender = function smartRender(ElementOrComponentOrLiteral, props, fallback) {
  if (ElementOrComponentOrLiteral === undefined) {
    ElementOrComponentOrLiteral = fallback;
  }

  if ( /*#__PURE__*/React.isValidElement(ElementOrComponentOrLiteral)) {
    // Flow cast through any, to make flow believe it's a React.Element
    var element = ElementOrComponentOrLiteral; // eslint-disable-line

    return element;
  } // Flow cast through any to remove React.Element after previous check

  /** @type {React.Component} */


  var ComponentOrLiteral = ElementOrComponentOrLiteral;

  if (typeof ComponentOrLiteral === 'string' || typeof ComponentOrLiteral === 'number' || typeof ComponentOrLiteral === 'boolean' || ComponentOrLiteral == null) {
    return ComponentOrLiteral;
  } // @ts-expect-error


  return /*#__PURE__*/React.createElement(ComponentOrLiteral, props);
};
/**
 * @type { import('prop-types').Validator<any> }
 **/

var checkChannelPropType = function checkChannelPropType(propValue, _, componentName) {
  var _propValue$constructo;

  if ((propValue === null || propValue === void 0 ? void 0 : (_propValue$constructo = propValue.constructor) === null || _propValue$constructo === void 0 ? void 0 : _propValue$constructo.name) !== Channel$2.name) {
    return Error("Failed prop type: Invalid prop `channel` of type `".concat(propValue.constructor.name, "` supplied to `").concat(componentName, "`, expected instance of `").concat(Channel$2.name, "`."));
  }

  return null;
};
/**
 * @type { import('prop-types').Validator<any> }
 **/

var checkClientPropType = function checkClientPropType(propValue, _, componentName) {
  var _propValue$constructo2;

  if ((propValue === null || propValue === void 0 ? void 0 : (_propValue$constructo2 = propValue.constructor) === null || _propValue$constructo2 === void 0 ? void 0 : _propValue$constructo2.name) !== StreamChat.name) {
    return Error("Failed prop type: Invalid prop `client` of type `".concat(propValue.constructor.name, "` supplied to `").concat(componentName, "`, expected instance of `").concat(StreamChat.name, "`."));
  }

  return null;
};

var Cancel="Cancel";var Close="Close";var Delete="Delete";var Delivered="Delivered";var Flag="Flag";var Mute="Mute";var New="New";var Pin="Pin";var Send="Send";var Thread="Thread";var Unmute="Unmute";var Unpin="Unpin";var live="live";var enTranslations = {"1 reply":"1 reply","Attach files":"Attach files",Cancel:Cancel,"Channel Missing":"Channel Missing",Close:Close,"Close emoji picker":"Close emoji picker","Commands matching":"Commands matching","Connection failure, reconnecting now...":"Connection failure, reconnecting now...",Delete:Delete,Delivered:Delivered,"Edit Message":"Edit Message","Emoji matching":"Emoji matching","Empty message...":"Empty message...","Error adding flag: Either the flag already exist or there is issue with network connection ...":"Error adding flag: Either the flag already exist or there is issue with network connection ...","Error connecting to chat, refresh the page to try again.":"Error connecting to chat, refresh the page to try again.","Error muting a user ...":"Error muting a user ...","Error pinning message":"Error pinning message","Error removing message pin":"Error removing message pin","Error unmuting a user ...":"Error unmuting a user ...","Error · Unsent":"Error · Unsent","Error: {{ errorMessage }}":"Error: {{ errorMessage }}",Flag:Flag,"Message Failed · Click to try again":"Message Failed · Click to try again","Message deleted":"Message deleted","Message failed. Click to try again.":"Message failed. Click to try again.","Message has been successfully flagged":"Message has been successfully flagged","Message pinned":"Message pinned",Mute:Mute,New:New,"New Messages!":"New Messages!","Nothing yet...":"Nothing yet...","Only visible to you":"Only visible to you","Open emoji picker":"Open emoji picker","People matching":"People matching","Pick your emoji":"Pick your emoji",Pin:Pin,"Pinned by":"Pinned by",Send:Send,"Sending...":"Sending...","Start of a new thread":"Start of a new thread","This message was deleted...":"This message was deleted...",Thread:Thread,"Type your message":"Type your message",Unmute:Unmute,Unpin:Unpin,"You have no channels currently":"You have no channels currently","You've reached the maximum number of files":"You've reached the maximum number of files",live:live,"this content could not be displayed":"this content could not be displayed","{{ commaSeparatedUsers }} and {{ lastUser }} are typing...":"{{ commaSeparatedUsers }} and {{ lastUser }} are typing...","{{ commaSeparatedUsers }} and {{ moreCount }} more":"{{ commaSeparatedUsers }} and {{ moreCount }} more","{{ commaSeparatedUsers }}, and {{ lastUser }}":"{{ commaSeparatedUsers }}, and {{ lastUser }}","{{ firstUser }} and {{ secondUser }}":"{{ firstUser }} and {{ secondUser }}","{{ firstUser }} and {{ secondUser }} are typing...":"{{ firstUser }} and {{ secondUser }} are typing...","{{ imageCount }} more":"{{ imageCount }} more","{{ memberCount }} members":"{{ memberCount }} members","{{ replyCount }} replies":"{{ replyCount }} replies","{{ user }} has been muted":"{{ user }} has been muted","{{ user }} has been unmuted":"{{ user }} has been unmuted","{{ user }} is typing...":"{{ user }} is typing...","{{ watcherCount }} online":"{{ watcherCount }} online","🏙 Attachment...":"🏙 Attachment..."};

var Cancel$1="Annuleer";var Close$1="Sluit";var Delete$1="Verwijder";var Delivered$1="Afgeleverd";var Flag$1="Markeer";var Mute$1="Mute";var New$1="Nieuwe";var Pin$1="Pin";var Send$1="Verstuur";var Thread$1="Draadje";var Unmute$1="Unmute";var Unpin$1="Losmaken";var live$1="live";var nlTranslations = {"1 reply":"1 antwoord","Attach files":"Bijlage toevoegen",Cancel:Cancel$1,"Channel Missing":"Kanaal niet gevonden",Close:Close$1,"Close emoji picker":"Sluit de emoji-kiezer","Commands matching":"Bijpassende opdrachten","Connection failure, reconnecting now...":"Probleem met de verbinding, opnieuw verbinding maken...",Delete:Delete$1,Delivered:Delivered$1,"Edit Message":"Pas bericht aan","Emoji matching":"Emoji-overeenkomsten","Empty message...":"Leeg bericht...","Error adding flag: Either the flag already exist or there is issue with network connection ...":"Fout bij het markeren: of het bericht is al gemarkeerd of er is een probleem met de netwerk verbinding","Error connecting to chat, refresh the page to try again.":"Fout bij het verbinden, ververs de pagina om nogmaals te proberen","Error muting a user ...":"Fout bij het muten van de gebruiker","Error pinning message":"Fout bij vastzetten van bericht","Error removing message pin":"Fout bij verwijderen van berichtpin","Error unmuting a user ...":"Fout bij het unmuten van de gebruiker","Error · Unsent":"Error: · niet verzonden","Error: {{ errorMessage }}":"Error: {{ errorMessage }}",Flag:Flag$1,"Message Failed · Click to try again":"Bericht mislukt, klik om het nogmaals te proberen","Message deleted":"Bericht verwijderd","Message failed. Click to try again.":"Bericht mislukt, klik om het nogmaals te proberen","Message has been successfully flagged":"Bericht is succesvol gemarkeerd","Message pinned":"Bericht vastgezet",Mute:Mute$1,New:New$1,"New Messages!":"Nieuwe Berichten!","Nothing yet...":"Nog niets ...","Only visible to you":"Alleen zichtbaar voor jou","Open emoji picker":"Open emojipicker","People matching":"Mensen die matchen","Pick your emoji":"Kies je emoji",Pin:Pin$1,"Pinned by":"Vastgemaakt door",Send:Send$1,"Sending...":"Aan het verzenden...","Start of a new thread":"Begin van een nieuwe draadje","This message was deleted...":"Dit bericht was verwijderd",Thread:Thread$1,"Type your message":"Type je bericht",Unmute:Unmute$1,Unpin:Unpin$1,"You have no channels currently":"Er zijn geen chats beschikbaar","You've reached the maximum number of files":"Je hebt het maximale aantal bestanden bereikt",live:live$1,"this content could not be displayed":"Deze inhoud kan niet weergegeven worden","{{ commaSeparatedUsers }} and {{ lastUser }} are typing...":"{{ commaSeparatedUsers }} en {{ lastUser }} zijn aan het typen ...","{{ commaSeparatedUsers }} and {{ moreCount }} more":"{{ commaSeparatedUsers }} en {{ moreCount }} meer","{{ commaSeparatedUsers }}, and {{ lastUser }}":"{{ commaSeparatedUsers }} en {{ lastUser }}","{{ firstUser }} and {{ secondUser }}":"{{ firstUser }} en {{ secondUser }}","{{ firstUser }} and {{ secondUser }} are typing...":"{{ firstUser }} en {{ secondUser }} zijn aan het typen ...","{{ imageCount }} more":"+{{ imageCount }}","{{ memberCount }} members":"{{ memberCount }} deelnemers","{{ replyCount }} replies":"{{ replyCount }} antwoorden","{{ user }} has been muted":"{{ user }} is muted","{{ user }} has been unmuted":"{{ user }} is unmuted","{{ user }} is typing...":"{{ user }} is aan het typen...","{{ watcherCount }} online":"{{ watcherCount }} online","🏙 Attachment...":"🏙 Bijlage..."};

var Cancel$2="Отмена";var Close$2="Закрыть";var Delete$2="Удалить";var Delivered$2="Отправлено";var Flag$2="Пожаловаться";var Mute$2="Отключить уведомления";var New$2="Новые";var Pin$2="Штырь";var Send$2="Отправить";var Thread$2="Ветка";var Unmute$2="Включить уведомления";var Unpin$2="Открепить";var live$2="В прямом эфире";var ruTranslations = {"1 reply":"1 ответ","Attach files":"Прикрепить файлы",Cancel:Cancel$2,"Channel Missing":"Канал не найден",Close:Close$2,"Close emoji picker":"Закрыть окно выбора смайлов","Commands matching":"Соответствие команд","Connection failure, reconnecting now...":"Ошибка соединения, переподключение...",Delete:Delete$2,Delivered:Delivered$2,"Edit Message":"Редактировать сообщение","Emoji matching":"Соответствие эмодзи","Empty message...":"Пустое сообщение...","Error adding flag: Either the flag already exist or there is issue with network connection ...":"Ошибка добавления флага: флаг уже существует или ошибка подключения к сети...","Error connecting to chat, refresh the page to try again.":"Ошибка подключения к чату, обновите страницу чтобы попробовать снова.","Error muting a user ...":"Ошибка отключения уведомлений от пользователя...","Error pinning message":"Сообщение об ошибке при закреплении","Error removing message pin":"Ошибка при удалении булавки сообщения","Error unmuting a user ...":"Ошибка включения уведомлений...","Error · Unsent":"Ошибка · Не отправлено","Error: {{ errorMessage }}":"Ошибка: {{ errorMessage }}",Flag:Flag$2,"Message Failed · Click to try again":"Ошибка отправки сообщения · Нажмите чтобы повторить","Message deleted":"Сообщение удалено","Message failed. Click to try again.":"Ошибка отправки сообщения · Нажмите чтобы повторить","Message has been successfully flagged":"Жалоба на сообщение была принята","Message pinned":"Сообщение закреплено",Mute:Mute$2,New:New$2,"New Messages!":"Новые сообщения!","Nothing yet...":"Пока ничего нет...","Only visible to you":"Только видно для вас","Open emoji picker":"Выбрать emoji","People matching":"Соответствующие люди","Pick your emoji":"Выберите свой emoji",Pin:Pin$2,"Pinned by":"Закреплено",Send:Send$2,"Sending...":"Отправка...","Start of a new thread":"Начало новой ветки","This message was deleted...":"Сообщение было удалено...",Thread:Thread$2,"Type your message":"Ваше сообщение",Unmute:Unmute$2,Unpin:Unpin$2,"You have no channels currently":"У вас нет каналов в данный момент","You've reached the maximum number of files":"Вы достигли максимального количества файлов",live:live$2,"this content could not be displayed":"Этот контент не может быть отображен в данный момент","{{ commaSeparatedUsers }} and {{ lastUser }} are typing...":"{{ commaSeparatedUsers }} и {{ lastUser }} пишут...","{{ commaSeparatedUsers }} and {{ moreCount }} more":"{{ commaSeparatedUsers }} и {{ moreCount }} еще","{{ commaSeparatedUsers }}, and {{ lastUser }}":"{{ commaSeparatedUsers }} и {{ lastUser }}","{{ firstUser }} and {{ secondUser }}":"{{ firstUser }} и {{ secondUser }}","{{ firstUser }} and {{ secondUser }} are typing...":"{{ firstUser }} и {{ secondUser }} пишут...","{{ imageCount }} more":"Ещё {{ imageCount }}","{{ memberCount }} members":"{{ memberCount }} члены","{{ replyCount }} replies":"{{ replyCount }} ответов","{{ user }} has been muted":"Вы отписались от уведомлений от {{ user }}","{{ user }} has been unmuted":"Уведомления от {{ user }} были включены","{{ user }} is typing...":"{{ user }} пишет...","{{ watcherCount }} online":"{{ watcherCount }} в сети","🏙 Attachment...":"🏙 Вложение..."};

var Cancel$3="İptal";var Close$3="Kapat";var Delete$3="Sil";var Delivered$3="İletildi";var Flag$3="Bayrak";var Mute$3="Sessiz";var New$3="Yeni";var Pin$3="Toplu iğne";var Send$3="Gönder";var Thread$3="Konu";var Unmute$3="Sesini aç";var Unpin$3="Sabitlemeyi kaldır";var live$3="canlı";var trTranslations = {"1 reply":"1 cevap","Attach files":"Dosya ekle",Cancel:Cancel$3,"Channel Missing":"Kanal bulunamıyor",Close:Close$3,"Close emoji picker":"Emoji seçiciyi kapat","Commands matching":"Eşleşen komutlar","Connection failure, reconnecting now...":"Bağlantı hatası, tekrar bağlanılıyor...",Delete:Delete$3,Delivered:Delivered$3,"Edit Message":"Mesajı Düzenle","Emoji matching":"Emoji eşleştirme","Empty message...":"Boş mesaj...","Error adding flag: Either the flag already exist or there is issue with network connection ...":"Bayraklama hatası: Bayrak zaten var veya bağlantı sorunlu","Error connecting to chat, refresh the page to try again.":"Bağlantı hatası, sayfayı yenileyip tekrar deneyin.","Error muting a user ...":"Kullanıcıyı sessize alırken hata oluştu ...","Error pinning message":"Mesaj sabitlenirken hata oluştu","Error removing message pin":"Mesaj PIN'i kaldırılırken hata oluştu","Error unmuting a user ...":"Kullanıcının sesini açarken hata oluştu ...","Error · Unsent":"Hata · Gönderilemedi","Error: {{ errorMessage }}":"Hata: {{ errorMessage }}",Flag:Flag$3,"Message Failed · Click to try again":"Mesaj Başarısız · Tekrar denemek için tıklayın","Message deleted":"Mesaj silindi","Message failed. Click to try again.":"Mesaj başarısız oldu. Tekrar denemek için tıklayın","Message has been successfully flagged":"Mesaj başarıyla bayraklandı","Message pinned":"Mesaj sabitlendi",Mute:Mute$3,New:New$3,"New Messages!":"Yeni Mesajlar!","Nothing yet...":"Şimdilik hiçbir şey...","Only visible to you":"Sadece size görünür","Open emoji picker":"Emoji klavyesini aç","People matching":"Eşleşen kişiler","Pick your emoji":"Emoji seçin",Pin:Pin$3,"Pinned by":"Sabitleyen",Send:Send$3,"Sending...":"Gönderiliyor...","Start of a new thread":"Yeni konunun başı","This message was deleted...":"Bu mesaj silindi",Thread:Thread$3,"Type your message":"Mesajınızı yazın",Unmute:Unmute$3,Unpin:Unpin$3,"You have no channels currently":"Henüz kanalınız yok","You've reached the maximum number of files":"Maksimum dosya sayısına ulaştınız",live:live$3,"this content could not be displayed":"bu içerik gösterilemiyor","{{ commaSeparatedUsers }} and {{ lastUser }} are typing...":"{{ commaSeparatedUsers }} ve {{ lastUser }} yazıyor...","{{ commaSeparatedUsers }} and {{ moreCount }} more":"{{ commaSeparatedUsers }} ve {{ moreCount }} daha","{{ commaSeparatedUsers }}, and {{ lastUser }}":"{{ commaSeparatedUsers }}, ve {{ lastUser }}","{{ firstUser }} and {{ secondUser }}":"{{ firstUser }} ve {{ secondUser }}","{{ firstUser }} and {{ secondUser }} are typing...":"{{ firstUser }} ve {{ secondUser }} yazıyor...","{{ imageCount }} more":"{{ imageCount }} adet daha","{{ memberCount }} members":"{{ memberCount }} üyeler","{{ replyCount }} replies":"{{ replyCount }} cevaplar","{{ user }} has been muted":"{{ user }} sessize alındı","{{ user }} has been unmuted":"{{ user }} sesi açıldı","{{ user }} is typing...":"{{ user }} yazıyor...","{{ watcherCount }} online":"{{ watcherCount }} çevrimiçi","🏙 Attachment...":"🏙 Ek..."};

var Cancel$4="Annuler";var Close$4="Fermer";var Delete$4="Supprimer";var Delivered$4="Publié";var Flag$4="Signaler";var Mute$4="Muet";var New$4="Nouveaux";var Pin$4="Épingle";var Send$4="Envoyer";var Thread$4="Fil de discussion";var Unmute$4="Désactiver muet";var Unpin$4="Détacher";var live$4="en direct";var frTranslations = {"1 reply":"1 réponse","Attach files":"Pièces jointes",Cancel:Cancel$4,"Channel Missing":"Canal Manquant",Close:Close$4,"Close emoji picker":"Fermer le sélecteur d'emojis","Commands matching":"Correspondance des commandes","Connection failure, reconnecting now...":"Échec de la connexion, reconnexion en cours...",Delete:Delete$4,Delivered:Delivered$4,"Edit Message":"Éditer un message","Emoji matching":"Correspondance emoji","Empty message...":"Message vide...","Error adding flag: Either the flag already exist or there is issue with network connection ...":"Erreur d'ajout du flag : le flag existe déjà ou vous rencontrez un problème de connexion au réseau ...","Error connecting to chat, refresh the page to try again.":"Erreur de connexion au chat, rafraîchissez la page pour réessayer.","Error muting a user ...":"Erreur de mise en sourdine d'un utilisateur ...","Error pinning message":"Erreur d'épinglage du message","Error removing message pin":"Erreur lors de la suppression du code PIN du message","Error unmuting a user ...":"Erreur de désactivation de la fonction sourdine pour un utilisateur ...","Error · Unsent":"Erreur - Non envoyé","Error: {{ errorMessage }}":"Erreur : {{ errorMessage }}",Flag:Flag$4,"Message Failed · Click to try again":"Échec de l'envoi du message - Cliquez pour réessayer","Message deleted":"Message supprimé","Message failed. Click to try again.":"Échec de l'envoi du message - Cliquez pour réessayer","Message has been successfully flagged":"Le message a été signalé avec succès","Message pinned":"Message épinglé",Mute:Mute$4,New:New$4,"New Messages!":"Nouveaux Messages!","Nothing yet...":"Aucun message...","Only visible to you":"Visible uniquement pour vous","Open emoji picker":"Ouvrez le sélecteur d'emoji","People matching":"Correspondance de personnes","Pick your emoji":"Choisissez votre emoji",Pin:Pin$4,"Pinned by":"Épinglé par",Send:Send$4,"Sending...":"Envoi en cours...","Start of a new thread":"Début d'un nouveau fil de discussion","This message was deleted...":"Ce message a été supprimé...",Thread:Thread$4,"Type your message":"Saisissez votre message",Unmute:Unmute$4,Unpin:Unpin$4,"You have no channels currently":"Vous n'avez actuellement aucun canal","You've reached the maximum number of files":"Vous avez atteint le nombre maximum de fichiers",live:live$4,"this content could not be displayed":"ce contenu n'a pu être affiché","{{ commaSeparatedUsers }} and {{ lastUser }} are typing...":"{{ commaSeparatedUsers }} et {{ lastUser }} sont en train d'écrire...","{{ commaSeparatedUsers }} and {{ moreCount }} more":"{{ commaSeparatedUsers }} et {{ moreCount }} autres","{{ commaSeparatedUsers }}, and {{ lastUser }}":"{{ commaSeparatedUsers }} et {{ lastUser }}","{{ firstUser }} and {{ secondUser }}":"{{ firstUser }} et {{ secondUser }}","{{ firstUser }} and {{ secondUser }} are typing...":"{{ firstUser }} et {{ secondUser }} sont en train d'écrire...","{{ imageCount }} more":"{{ imageCount }} supplémentaires","{{ memberCount }} members":"{{ memberCount }} membres","{{ replyCount }} replies":"{{ replyCount }} réponses","{{ user }} has been muted":"{{ user }} a été mis en sourdine","{{ user }} has been unmuted":"{{ user }} n'est plus en sourdine","{{ user }} is typing...":"{{ user }} est en train d'écrire...","{{ watcherCount }} online":"{{ watcherCount }} en ligne","🏙 Attachment...":"🏙 Pièce jointe..."};

var Cancel$5="रद्द करें";var Close$5="बंद करे";var Delete$5="डिलीट";var Delivered$5="पहुंच गया";var Flag$5="फ्लैग करे";var Mute$5="म्यूट करे";var New$5="नए";var Pin$5="पिन";var Send$5="भेजे";var Thread$5="रिप्लाई थ्रेड";var Unmute$5="अनम्यूट";var Unpin$5="अनपिन";var live$5="लाइव";var hiTranslations = {"1 reply":"1 रिप्लाई","Attach files":"फाइल्स अटैच करे",Cancel:Cancel$5,"Channel Missing":"चैनल उपलब्ध नहीं है",Close:Close$5,"Close emoji picker":"इमोजी पिकर बंद करें","Commands matching":"मेल खाती है","Connection failure, reconnecting now...":"कनेक्शन विफल रहा, अब पुनः कनेक्ट हो रहा है ...",Delete:Delete$5,Delivered:Delivered$5,"Edit Message":"मैसेज में बदलाव करे","Emoji matching":"इमोजी मिलान","Empty message...":"खाली संदेश ...","Error adding flag: Either the flag already exist or there is issue with network connection ...":"फ़ैल: या तो यह मैसेज के ऊपर पहले से फ्लैग है या तो आपके इंटरनेट कनेक्शन में कुछ परेशानी है","Error connecting to chat, refresh the page to try again.":"चैट से कनेक्ट करने में त्रुटि, पेज को रिफ्रेश करें","Error muting a user ...":"यूजर को म्यूट करने का प्रयास फेल हुआ","Error pinning message":"संदेश को पिन करने में त्रुटि","Error removing message pin":"संदेश पिन निकालने में त्रुटि","Error unmuting a user ...":"यूजर को अनम्यूट करने का प्रयास फेल हुआ","Error · Unsent":"फेल","Error: {{ errorMessage }}":"फेल: {{ errorMessage }}",Flag:Flag$5,"Message Failed · Click to try again":"मैसेज फ़ैल - पुनः कोशिश करें","Message deleted":"मैसेज हटा दिया गया","Message failed. Click to try again.":"मैसेज फ़ैल - पुनः कोशिश करें","Message has been successfully flagged":"मैसेज को फ्लैग कर दिया गया है","Message pinned":"संदेश पिन किया गया",Mute:Mute$5,New:New$5,"New Messages!":"नए मैसेज!","Nothing yet...":"कोई मैसेज नहीं है","Only visible to you":"सिर्फ आपको दिखाई दे रहा है","Open emoji picker":"इमोजी पिकर खोलिये","People matching":"मेल खाते लोग","Pick your emoji":"इमोजी चूस करे",Pin:Pin$5,"Pinned by":"द्वारा पिन किया गया",Send:Send$5,"Sending...":"भेजा जा रहा है","Start of a new thread":"एक नए थ्रेड की शुरुआत","This message was deleted...":"मैसेज हटा दिया गया",Thread:Thread$5,"Type your message":"अपना मैसेज लिखे",Unmute:Unmute$5,Unpin:Unpin$5,"You have no channels currently":"आपके पास कोई चैनल नहीं है","You've reached the maximum number of files":"आप अधिकतम फ़ाइलों तक पहुँच गए हैं",live:live$5,"this content could not be displayed":"यह कॉन्टेंट लोड नहीं हो पाया","{{ commaSeparatedUsers }} and {{ lastUser }} are typing...":"{{ commaSeparatedUsers }} और {{ lastUser }} टाइप कर रहे हैं...","{{ commaSeparatedUsers }} and {{ moreCount }} more":"{{ commaSeparatedUsers }} और {{ moreCount }} और","{{ commaSeparatedUsers }}, and {{ lastUser }}":"{{ commaSeparatedUsers }} और {{ lastUser }}","{{ firstUser }} and {{ secondUser }}":"{{ firstUser }} और {{ secondUser }}","{{ firstUser }} and {{ secondUser }} are typing...":"{{ firstUser }} और {{ secondUser }} टाइप कर रहे हैं...","{{ imageCount }} more":"{{ imageCount }} और","{{ memberCount }} members":"{{ memberCount }} मेंबर्स","{{ replyCount }} replies":"{{ replyCount }} रिप्लाई","{{ user }} has been muted":"{{ user }} को म्यूट कर दिया गया है","{{ user }} has been unmuted":"{{ user }} को अनम्यूट कर दिया गया है","{{ user }} is typing...":"{{ user }} टाइप कर रहा है...","{{ watcherCount }} online":"{{ watcherCount }} online","🏙 Attachment...":"🏙 अटैचमेंट"};

var Cancel$6="Annulla";var Close$6="Chiudi";var Delete$6="Cancella";var Delivered$6="Consegnato";var Flag$6="Segnala";var Mute$6="Silenzia";var New$6="Nuovo";var Pin$6="Pin";var Send$6="Invia";var Thread$6="Thread";var Unmute$6="Riattiva le notifiche";var Unpin$6="Sblocca";var live$6="live";var itTranslations = {"1 reply":"Una risposta","Attach files":"Allega file",Cancel:Cancel$6,"Channel Missing":"Il canale non esiste",Close:Close$6,"Close emoji picker":"Chiudi il selettore di emoji","Commands matching":"Comandi corrispondenti","Connection failure, reconnecting now...":"Connessione fallitta, riconnessione in corso...",Delete:Delete$6,Delivered:Delivered$6,"Edit Message":"Modifica messaggio","Emoji matching":"Abbinamento emoji","Empty message...":"Message vuoto...","Error adding flag: Either the flag already exist or there is issue with network connection ...":"Errore durante la segnalazione: la segnalazione esiste giá o c'é un problema di connessione ...","Error connecting to chat, refresh the page to try again.":"Errore di connessione alla chat, aggiorna la pagina per riprovare","Error muting a user ...":"Errore silenziando un utente ...","Error pinning message":"Errore durante il blocco del messaggio","Error removing message pin":"Errore durante la rimozione del PIN del messaggio","Error unmuting a user ...":"Errore riattivando le notifiche per l'utente ...","Error · Unsent":"Errore · Non inviato","Error: {{ errorMessage }}":"Errore: {{ errorMessage }}",Flag:Flag$6,"Message Failed · Click to try again":"Invio messaggio fallito · Clicca per riprovare","Message deleted":"Messaggio cancellato","Message failed. Click to try again.":"Invio messaggio fallito. Clicca per riprovare.","Message has been successfully flagged":"Il messaggio é stato segnalato con successo","Message pinned":"Messaggio bloccato",Mute:Mute$6,New:New$6,"New Messages!":"Nuovo messaggio!","Nothing yet...":"Ancora niente...","Only visible to you":"Visibile soltanto da te","Open emoji picker":"Apri il selettore dellle emoji","People matching":"Persone che corrispondono","Pick your emoji":"Scegli la tua emoji",Pin:Pin$6,"Pinned by":"Appuntato da",Send:Send$6,"Sending...":"Invio in corso...","Start of a new thread":"Inizia un nuovo thread","This message was deleted...":"Questo messaggio é stato cancellato",Thread:Thread$6,"Type your message":"Scrivi il tuo messaggio",Unmute:Unmute$6,Unpin:Unpin$6,"You have no channels currently":"Al momento non sono presenti canali","You've reached the maximum number of files":"Hai raggiunto il numero massimo di file",live:live$6,"this content could not be displayed":"questo contenuto non puó essere mostrato","{{ commaSeparatedUsers }} and {{ lastUser }} are typing...":"{{ commaSeparatedUsers }} e {{ lastUser }} stanno scrivendo...","{{ commaSeparatedUsers }} and {{ moreCount }} more":"{{ commaSeparatedUsers }} e altri {{ moreCount }}","{{ commaSeparatedUsers }}, and {{ lastUser }}":"{{ commaSeparatedUsers }} e {{ lastUser }}","{{ firstUser }} and {{ secondUser }}":"{{ firstUser }} e {{ secondUser }}","{{ firstUser }} and {{ secondUser }} are typing...":"{{ firstUser }} e {{ secondUser }} stanno scrivendo...","{{ imageCount }} more":"+ {{ imageCount }}","{{ memberCount }} members":"{{ memberCount }} membri","{{ replyCount }} replies":"{{ replyCount }} risposte","{{ user }} has been muted":"{{ user }} é stato silenziato","{{ user }} has been unmuted":"Notifiche riattivate per {{ user }}","{{ user }} is typing...":"{{ user }} sta scrivendo...","{{ watcherCount }} online":"{{ watcherCount }} online","🏙 Attachment...":"🏙 Allegato..."};

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var defaultNS = 'translation';
var defaultLng = 'en';
Dayjs.extend(updateLocale);
Dayjs.updateLocale('nl', {
  calendar: {
    sameDay: '[vandaag om] LT',
    nextDay: '[morgen om] LT',
    nextWeek: 'dddd [om] LT',
    lastDay: '[gisteren om] LT',
    lastWeek: '[afgelopen] dddd [om] LT',
    sameElse: 'L'
  }
});
Dayjs.updateLocale('it', {
  calendar: {
    sameDay: '[Oggi alle] LT',
    nextDay: '[Domani alle] LT',
    nextWeek: 'dddd [alle] LT',
    lastDay: '[Ieri alle] LT',
    lastWeek: '[lo scorso] dddd [alle] LT',
    sameElse: 'L'
  }
});
Dayjs.updateLocale('hi', {
  calendar: {
    sameDay: '[आज] LT',
    nextDay: '[कल] LT',
    nextWeek: 'dddd, LT',
    lastDay: '[कल] LT',
    lastWeek: '[पिछले] dddd, LT',
    sameElse: 'L'
  },
  // Hindi notation for meridiems are quite fuzzy in practice. While there exists
  // a rigid notion of a 'Pahar' it is not used as rigidly in modern Hindi.
  meridiemParse: /रात|सुबह|दोपहर|शाम/,

  meridiemHour(hour, meridiem) {
    if (hour === 12) {
      hour = 0;
    }

    if (meridiem === 'रात') {
      return hour < 4 ? hour : hour + 12;
    } else if (meridiem === 'सुबह') {
      return hour;
    } else if (meridiem === 'दोपहर') {
      return hour >= 10 ? hour : hour + 12;
    } else if (meridiem === 'शाम') {
      return hour + 12;
    }
  },

  meridiem(hour) {
    if (hour < 4) {
      return 'रात';
    } else if (hour < 10) {
      return 'सुबह';
    } else if (hour < 17) {
      return 'दोपहर';
    } else if (hour < 20) {
      return 'शाम';
    } else {
      return 'रात';
    }
  }

});
Dayjs.updateLocale('fr', {
  calendar: {
    sameDay: '[Aujourd’hui à] LT',
    nextDay: '[Demain à] LT',
    nextWeek: 'dddd [à] LT',
    lastDay: '[Hier à] LT',
    lastWeek: 'dddd [dernier à] LT',
    sameElse: 'L'
  }
});
Dayjs.updateLocale('tr', {
  calendar: {
    sameDay: '[bugün saat] LT',
    nextDay: '[yarın saat] LT',
    nextWeek: '[gelecek] dddd [saat] LT',
    lastDay: '[dün] LT',
    lastWeek: '[geçen] dddd [saat] LT',
    sameElse: 'L'
  }
});
Dayjs.updateLocale('ru', {
  calendar: {
    sameDay: '[Сегодня, в] LT',
    nextDay: '[Завтра, в] LT',
    lastDay: '[Вчера, в] LT'
  }
});
var en_locale = {
  weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
  months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_')
};
/**
 * Wrapper around [i18next](https://www.i18next.com/) class for Stream related translations.
 * Instance of this class should be provided to Chat component to handle translations.
 * Stream provides following list of in-built translations:
 * 1. English (en)
 * 2. Dutch (nl)
 * 3. Russian (ru)
 * 4. Turkish (tr)
 * 5. French (fr)
 * 6. Italian (it)
 * 7. Hindi (hi)
 *
 * Simplest way to start using chat components in one of the in-built languages would be following:
 *
 * ```
 * const i18n = new Streami18n({ language 'nl' });
 * <Chat client={chatClient} i18nInstance={i18n}>
 *  ...
 * </Chat>
 * ```
 *
 * If you would like to override certain keys in in-built translation.
 * UI will be automatically updated in this case.
 *
 * ```
 * const i18n = new Streami18n({
 *  language: 'nl',
 *  translationsForLanguage: {
 *    'Nothing yet...': 'Nog Niet ...',
 *    '{{ firstUser }} and {{ secondUser }} are typing...': '{{ firstUser }} en {{ secondUser }} zijn aan het typen...',
 *  }
 * });
 *
 * If you would like to register additional languages, use registerTranslation. You can add as many languages as you want:
 *
 * i18n.registerTranslation('zh', {
 *  'Nothing yet...': 'Nog Niet ...',
 *  '{{ firstUser }} and {{ secondUser }} are typing...': '{{ firstUser }} en {{ secondUser }} zijn aan het typen...',
 * });
 *
 * <Chat client={chatClient} i18nInstance={i18n}>
 *  ...
 * </Chat>
 * ```
 *
 * You can use the same function to add whole new language as well.
 *
 * ```
 * const i18n = new Streami18n();
 *
 * i18n.registerTranslation('mr', {
 *  'Nothing yet...': 'काहीही नाही  ...',
 *  '{{ firstUser }} and {{ secondUser }} are typing...': '{{ firstUser }} आणि {{ secondUser }} टीपी करत आहेत ',
 * });
 *
 * // Make sure to call setLanguage to reflect new language in UI.
 * i18n.setLanguage('it');
 * <Chat client={chatClient} i18nInstance={i18n}>
 *  ...
 * </Chat>
 * ```
 *
 * ## Datetime translations
 *
 * Stream react chat components uses [dayjs](https://day.js.org/en/) internally by default to format datetime stamp.
 * e.g., in ChannelPreview, MessageContent components.
 * Dayjs has locale support as well - https://day.js.org/docs/en/i18n/i18n
 * Dayjs is a lightweight alternative to Momentjs with the same modern API.
 *
 * Dayjs provides locale config for plenty of languages, you can check the whole list of locale configs at following url
 * https://github.com/iamkun/dayjs/tree/dev/src/locale
 *
 * You can either provide the dayjs locale config while registering
 * language with Streami18n (either via constructor or registerTranslation()) or you can provide your own Dayjs or Moment instance
 * to Streami18n constructor, which will be then used internally (using the language locale) in components.
 *
 * 1. Via language registration
 *
 * e.g.,
 * ```
 * const i18n = new Streami18n({
 *  language: 'nl',
 *  dayjsLocaleConfigForLanguage: {
 *    months: [...],
 *    monthsShort: [...],
 *    calendar: {
 *      sameDay: ...'
 *    }
 *  }
 * });
 * ```
 *
 * Similarly, you can add locale config for moment while registering translation via `registerTranslation` function.
 *
 * e.g.,
 * ```
 * const i18n = new Streami18n();
 *
 * i18n.registerTranslation(
 *  'mr',
 *  {
 *    'Nothing yet...': 'काहीही नाही  ...',
 *    '{{ firstUser }} and {{ secondUser }} are typing...': '{{ firstUser }} आणि {{ secondUser }} टीपी करत आहेत ',
 *  },
 *  {
 *    months: [...],
 *    monthsShort: [...],
 *    calendar: {
 *      sameDay: ...'
 *    }
 *  }
 * );
 *```
 * 2. Provide your own Moment object
 *
 * ```js
 * import 'moment/locale/nl';
 * import 'moment/locale/it';
 * // or if you want to include all locales
 * import 'moment/min/locales';
 *
 * import Moment from moment
 *
 * const i18n = new Streami18n({
 *  language: 'nl',
 *  DateTimeParser: Moment
 * })
 * ```
 *
 * 3. Provide your own Dayjs object
 *
 * ```js
 * import Dayjs from 'dayjs'
 *
 * import 'dayjs/locale/nl';
 * import 'dayjs/locale/it';
 * // or if you want to include all locales
 * import 'dayjs/min/locales';
 *
 * const i18n = new Streami18n({
 *  language: 'nl',
 *  DateTimeParser: Dayjs
 * })
 * ```
 * If you would like to stick with english language for datetimes in Stream compoments, you can set `disableDateTimeTranslations` to true.
 *
 */

var defaultStreami18nOptions = {
  language: 'en',
  disableDateTimeTranslations: false,
  debug: false,
  logger: function logger(msg) {
    return console.warn(msg);
  },
  dayjsLocaleConfigForLanguage: null,
  DateTimeParser: Dayjs
};
var Streami18n = /*#__PURE__*/function () {
  /**
   * dayjs.defineLanguage('nl') also changes the global locale. We don't want to do that
   * when user calls registerTranslation() function. So intead we will store the locale configs
   * given to registerTranslation() function in `dayjsLocales` object, and register the required locale
   * with moment, when setLanguage is called.
   * */

  /**
   * Contructor accepts following options:
   *  - language (String) default: 'en'
   *    Language code e.g., en, tr
   *
   *  - translationsForLanguage (object)
   *    Translations object. Please check src/i18n/en.json for example.
   *
   *  - disableDateTimeTranslations (boolean) default: false
   *    Disable translations for datetimes
   *
   *  - debug (boolean) default: false
   *    Enable debug mode in internal i18n class
   *
   *  - logger (function) default: () => {}
   *    Logger function to log warnings/errors from this class
   *
   *  - dayjsLocaleConfigForLanguage (object) default: 'enConfig'
   *    [Config object](https://momentjs.com/docs/#/i18n/changing-locale/) for internal moment object,
   *    corresponding to language (param)
   *
   *  - DateTimeParser (function) Moment or Dayjs instance/function.
   *    Make sure to load all the required locales in this Moment or Dayjs instance that you will be provide to Streami18n
   *
   * @param {*} options
   */
  function Streami18n() {
    var _this = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Streami18n);

    _defineProperty(this, "i18nInstance", i18n.createInstance());

    _defineProperty(this, "Dayjs", null);

    _defineProperty(this, "setLanguageCallback", function () {
      return null;
    });

    _defineProperty(this, "initialized", false);

    _defineProperty(this, "t", null);

    _defineProperty(this, "tDateTimeParser", null);

    _defineProperty(this, "translations", {
      en: {
        [defaultNS]: enTranslations
      },
      nl: {
        [defaultNS]: nlTranslations
      },
      ru: {
        [defaultNS]: ruTranslations
      },
      tr: {
        [defaultNS]: trTranslations
      },
      fr: {
        [defaultNS]: frTranslations
      },
      hi: {
        [defaultNS]: hiTranslations
      },
      it: {
        [defaultNS]: itTranslations
      }
    });

    _defineProperty(this, "dayjsLocales", {});

    _defineProperty(this, "localeExists", function (language) {
      if (_this.isCustomDateTimeParser) return true;
      return Object.keys(Dayjs.Ls).indexOf(language) > -1;
    });

    _defineProperty(this, "validateCurrentLanguage", function () {
      var availableLanguages = Object.keys(_this.translations);

      if (availableLanguages.indexOf(_this.currentLanguage) === -1) {
        _this.logger("Streami18n: '".concat(_this.currentLanguage, "' language is not registered.") + " Please make sure to call streami18n.registerTranslation('".concat(_this.currentLanguage, "', {...}) or ") + "use one the built-in supported languages - ".concat(_this.getAvailableLanguages()));

        _this.currentLanguage = defaultLng;
      }
    });

    _defineProperty(this, "geti18Instance", function () {
      return _this.i18nInstance;
    });

    _defineProperty(this, "getAvailableLanguages", function () {
      return Object.keys(_this.translations);
    });

    _defineProperty(this, "getTranslations", function () {
      return _this.translations;
    });

    var finalOptions = _objectSpread(_objectSpread({}, defaultStreami18nOptions), options); // Prepare the i18next configuration.


    this.logger = finalOptions.logger;
    this.currentLanguage = finalOptions.language;
    this.DateTimeParser = finalOptions.DateTimeParser;

    try {
      // This is a shallow check to see if given parser is instance of Dayjs.
      // For some reason Dayjs.isDayjs(this.DateTimeParser()) doesn't work.
      if (this.DateTimeParser && this.DateTimeParser.extend) {
        this.DateTimeParser.extend(LocalizedFormat);
        this.DateTimeParser.extend(calendar);
        this.DateTimeParser.extend(localeData);
        this.DateTimeParser.extend(relativeTime);
      }
    } catch (error) {
      throw Error("Streami18n: Looks like you wanted to provide Dayjs instance, but something went wrong while adding plugins ".concat(error));
    }

    this.isCustomDateTimeParser = !!options.DateTimeParser;
    var translationsForLanguage = finalOptions.translationsForLanguage;

    if (translationsForLanguage) {
      this.translations[this.currentLanguage] = {
        [defaultNS]: translationsForLanguage
      };
    } // If translations don't exist for given language, then set it as empty object.


    if (!this.translations[this.currentLanguage]) {
      this.translations[this.currentLanguage] = {
        [defaultNS]: {}
      };
    }

    this.i18nextConfig = {
      nsSeparator: false,
      keySeparator: false,
      fallbackLng: false,
      debug: finalOptions.debug,
      lng: this.currentLanguage,
      interpolation: {
        escapeValue: false
      },
      parseMissingKeyHandler: function parseMissingKeyHandler(key) {
        _this.logger("Streami18n: Missing translation for key: ".concat(key));

        return key;
      }
    };
    this.validateCurrentLanguage(this.currentLanguage);
    var dayjsLocaleConfigForLanguage = finalOptions.dayjsLocaleConfigForLanguage;

    if (dayjsLocaleConfigForLanguage) {
      this.addOrUpdateLocale(this.currentLanguage, _objectSpread({}, dayjsLocaleConfigForLanguage));
    } else if (!this.localeExists(this.currentLanguage)) {
      this.logger("Streami18n: Streami18n(...) - Locale config for ".concat(this.currentLanguage, " does not exist in momentjs.") + "Please import the locale file using \"import 'moment/locale/".concat(this.currentLanguage, "';\" in your app or ") + "register the locale config with Streami18n using registerTranslation(language, translation, customDayjsLocale)");
    }

    this.tDateTimeParser = function (timestamp) {
      if (finalOptions.disableDateTimeTranslations || !_this.localeExists(_this.currentLanguage)) {
        return _this.DateTimeParser(timestamp).locale(defaultLng);
      }

      return _this.DateTimeParser(timestamp).locale(_this.currentLanguage);
    };
  }
  /**
   * Initializes the i18next instance with configuration (which enables natural language as default keys)
   */


  _createClass(Streami18n, [{
    key: "init",
    value: function () {
      var _init = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.validateCurrentLanguage();
                _context.prev = 1;
                _context.next = 4;
                return this.i18nInstance.init(_objectSpread(_objectSpread({}, this.i18nextConfig), {}, {
                  resources: this.translations,
                  lng: this.currentLanguage
                }));

              case 4:
                this.t = _context.sent;
                this.initialized = true;
                return _context.abrupt("return", {
                  t: this.t,
                  tDateTimeParser: this.tDateTimeParser
                });

              case 9:
                _context.prev = 9;
                _context.t0 = _context["catch"](1);
                this.logger("Something went wrong with init:", _context.t0);

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 9]]);
      }));

      function init() {
        return _init.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "getTranslators",

    /**
     * Returns current version translator function.
     */
    value: function () {
      var _getTranslators = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (this.initialized) {
                  _context2.next = 7;
                  break;
                }

                if (this.dayjsLocales[this.currentLanguage]) {
                  this.addOrUpdateLocale(this.currentLanguage, this.dayjsLocales[this.currentLanguage]);
                }

                _context2.next = 4;
                return this.init();

              case 4:
                return _context2.abrupt("return", _context2.sent);

              case 7:
                return _context2.abrupt("return", {
                  t: this.t,
                  tDateTimeParser: this.tDateTimeParser
                });

              case 8:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getTranslators() {
        return _getTranslators.apply(this, arguments);
      }

      return getTranslators;
    }()
    /**
     * Register translation
     *
     * @param {*} language
     * @param {*} translation
     * @param {*} customDayjsLocale
     */

  }, {
    key: "registerTranslation",
    value: function registerTranslation(language, translation, customDayjsLocale) {
      if (!translation) {
        this.logger("Streami18n: registerTranslation(language, translation, customDayjsLocale) called without translation");
        return;
      }

      if (!this.translations[language]) {
        this.translations[language] = {
          [defaultNS]: translation
        };
      } else {
        this.translations[language][defaultNS] = translation;
      }

      if (customDayjsLocale) {
        this.dayjsLocales[language] = _objectSpread({}, customDayjsLocale);
      } else if (!this.localeExists(language)) {
        this.logger("Streami18n: registerTranslation(language, translation, customDayjsLocale) - " + "Locale config for ".concat(language, " does not exist in Dayjs.") + "Please import the locale file using \"import 'dayjs/locale/".concat(language, "';\" in your app or ") + "register the locale config with Streami18n using registerTranslation(language, translation, customDayjsLocale)");
      }

      if (this.initialized) {
        this.i18nInstance.addResources(language, defaultNS, translation);
      }
    }
  }, {
    key: "addOrUpdateLocale",
    value: function addOrUpdateLocale(key, config) {
      if (this.localeExists(key)) {
        Dayjs.updateLocale(key, _objectSpread({}, config));
      } else {
        // Merging the custom locale config with en config, so missing keys can default to english.
        Dayjs.locale(_objectSpread({
          name: key
        }, _objectSpread(_objectSpread({}, en_locale), config)), null, true);
      }
    }
    /**
     * Changes the language.
     * @param {*} language
     */

  }, {
    key: "setLanguage",
    value: function () {
      var _setLanguage = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(language) {
        var t;
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                this.currentLanguage = language;

                if (this.initialized) {
                  _context3.next = 3;
                  break;
                }

                return _context3.abrupt("return");

              case 3:
                _context3.prev = 3;
                _context3.next = 6;
                return this.i18nInstance.changeLanguage(language);

              case 6:
                t = _context3.sent;

                if (this.dayjsLocales[language]) {
                  this.addOrUpdateLocale(this.currentLanguage, this.dayjsLocales[this.currentLanguage]);
                }

                this.setLanguageCallback(t);
                return _context3.abrupt("return", t);

              case 12:
                _context3.prev = 12;
                _context3.t0 = _context3["catch"](3);
                this.logger("Failed to set language:", _context3.t0);

              case 15:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[3, 12]]);
      }));

      function setLanguage(_x) {
        return _setLanguage.apply(this, arguments);
      }

      return setLanguage;
    }()
    /**
     * @param {(t: import('i18next').TFunction) => void} callback
     */

  }, {
    key: "registerSetLanguageCallback",
    value: function registerSetLanguageCallback(callback) {
      this.setLanguageCallback = callback;
    }
  }]);

  return Streami18n;
}();

/**
 * AttachmentActions - The actions you can take on an attachment
 *
 * @example ../../docs/AttachmentActions.md
 * @type {React.FC<import('type').AttachmentActionsProps>}
 */

var AttachmentActions = function AttachmentActions(_ref) {
  var text = _ref.text,
      id = _ref.id,
      actions = _ref.actions,
      actionHandler = _ref.actionHandler;
  return /*#__PURE__*/React.createElement("div", {
    className: "str-chat__message-attachment-actions"
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__message-attachment-actions-form"
  }, /*#__PURE__*/React.createElement("span", {
    key: 0
  }, text), actions.map(function (action) {
    return /*#__PURE__*/React.createElement("button", {
      className: "str-chat__message-attachment-actions-button str-chat__message-attachment-actions-button--".concat(action.style),
      "data-testid": "".concat(action.name),
      key: "".concat(id, "-").concat(action.value),
      "data-value": action.value,
      onClick: function onClick(e) {
        return actionHandler(action.name, action.value, e);
      }
    }, action.text);
  })));
};

AttachmentActions.propTypes = {
  /** Unique id for action button key. Key is generated by concatenating this id with action value - {`${id}-${action.value}`} */
  id: PropTypes.string.isRequired,

  /** The text for the form input */
  text: PropTypes.string,

  /** A list of actions */
  actions: PropTypes.array.isRequired,

  /**
   *
   * @param name {string} Name of action
   * @param value {string} Value of action
   * @param event Dom event that triggered this handler
   */
  actionHandler: PropTypes.func.isRequired
};
var DefaultAttachmentActions = /*#__PURE__*/React.memo(AttachmentActions);

var progressUpdateInterval = 500;
/**
 * Audio attachment with play/pause button and progress bar
 * @param {import("types").AudioProps} props
 */

var Audio = function Audio(_ref) {
  var og = _ref.og;
  var audioRef = useRef(
  /** @type {HTMLAudioElement | null} */
  null);

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isPlaying = _useState2[0],
      setIsPlaying = _useState2[1];

  var _useState3 = useState(0),
      _useState4 = _slicedToArray(_useState3, 2),
      progress = _useState4[0],
      setProgress = _useState4[1];

  var updateProgress = useCallback(function () {
    if (audioRef.current !== null) {
      var position = audioRef.current.currentTime;
      var duration = audioRef.current.duration;
      var currentProgress = 100 / duration * position;
      setProgress(currentProgress);

      if (position === duration) {
        setIsPlaying(false);
      }
    }
  }, [audioRef]);
  useEffect(function () {
    if (audioRef.current !== null) {
      if (isPlaying) {
        audioRef.current.play();
        var interval = setInterval(updateProgress, progressUpdateInterval);
        return function () {
          return clearInterval(interval);
        };
      }

      audioRef.current.pause();
    }

    return function () {};
  }, [isPlaying, updateProgress]);
  var asset_url = og.asset_url,
      image_url = og.image_url,
      title = og.title,
      description = og.description,
      text = og.text;
  return /*#__PURE__*/React.createElement("div", {
    className: "str-chat__audio"
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__audio__wrapper"
  }, /*#__PURE__*/React.createElement("audio", {
    ref: audioRef
  }, /*#__PURE__*/React.createElement("source", {
    src: asset_url,
    type: "audio/mp3",
    "data-testid": "audio-source"
  })), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__audio__image"
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__audio__image--overlay"
  }, !isPlaying ? /*#__PURE__*/React.createElement("div", {
    onClick: function onClick() {
      return setIsPlaying(true);
    },
    className: "str-chat__audio__image--button",
    "data-testid": "play-audio"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "40",
    height: "40",
    viewBox: "0 0 64 64",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M32 58c14.36 0 26-11.64 26-26S46.36 6 32 6 6 17.64 6 32s11.64 26 26 26zm0 6C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32zm13.237-28.412L26.135 45.625a3.27 3.27 0 0 1-4.426-1.4 3.319 3.319 0 0 1-.372-1.47L21 23.36c-.032-1.823 1.41-3.327 3.222-3.358a3.263 3.263 0 0 1 1.473.322l19.438 9.36a3.311 3.311 0 0 1 .103 5.905z",
    fillRule: "nonzero"
  }))) : /*#__PURE__*/React.createElement("div", {
    onClick: function onClick() {
      return setIsPlaying(false);
    },
    className: "str-chat__audio__image--button",
    "data-testid": "pause-audio"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "40",
    height: "40",
    viewBox: "0 0 64 64",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M32 58.215c14.478 0 26.215-11.737 26.215-26.215S46.478 5.785 32 5.785 5.785 17.522 5.785 32 17.522 58.215 32 58.215zM32 64C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32zm-7.412-45.56h2.892a2.17 2.17 0 0 1 2.17 2.17v23.865a2.17 2.17 0 0 1-2.17 2.17h-2.892a2.17 2.17 0 0 1-2.17-2.17V20.61a2.17 2.17 0 0 1 2.17-2.17zm12.293 0h2.893a2.17 2.17 0 0 1 2.17 2.17v23.865a2.17 2.17 0 0 1-2.17 2.17h-2.893a2.17 2.17 0 0 1-2.17-2.17V20.61a2.17 2.17 0 0 1 2.17-2.17z",
    fillRule: "nonzero"
  })))), image_url && /*#__PURE__*/React.createElement("img", {
    src: image_url,
    alt: "".concat(description)
  })), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__audio__content"
  }, /*#__PURE__*/React.createElement("span", {
    className: "str-chat__audio__content--title"
  }, /*#__PURE__*/React.createElement("strong", null, title)), /*#__PURE__*/React.createElement("span", {
    className: "str-chat__audio__content--subtitle"
  }, text), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__audio__content--progress"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "".concat(progress, "%")
    },
    "data-testid": "audio-progress"
  })))));
};

var DefaultAudio = /*#__PURE__*/React.memo(Audio);

var giphyLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAkCAYAAAB/up84AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABVhJREFUeNrsW6GS20AMdToGBgEGAQYBBgEBBQYFgQcP5hMO9jP6CYWFBwsPBgYUGBQEFAQUGAQYBBgYGHjmutt5O6NupbXXcZJrx5rJXGyv11o96Ukr52avr6/BJG9HZmMBMpvNYnxt1JzNZNoRAYFxM2Z8rT6FuueMcaH6s1KfhBn3U42r1Jg1rrfq+Bt5xgf1Z64+uQFQndNzLc1Ydfwg6F2p6wd1PVXfU+b6Gc9vHGuh8+jrsXVN61Sq64XggNw95tlH9XmP6y3W2OI+qvN3db6mN7/zBFAb8L2aNMJxRsDQC6jIuEyN039LnAvV8QJKRRijZUHmT8iiLpEFDHKJaB1TGN732WuAokEIDQCwhwGjsMEIMNgp6qY9JlsTgyXquCFG1d54IsbOsKAVPLDBcQJjUxB0RJwAltGntNQ46GhzqPnb0y0954RG/1iLQ7SRCkR+guiPtW6GFRg5gAlCrFvbJEZ0ngDAUn0/Y77fDCJFXuiB/AmGDC3PLg0YWLRW5CcJWWPglNxDKS6C59AcZBs/sYxbOQBqHHkuZYCsGCds4SQJDDx3RK3RjUb9EfMUcLQ57BHS64MAIYtYkvEt+d4wCzqr++ipkoTtkihOI2chREfA5KiC0GOAaMig05zoWJPjgMk39jxcPphDR0mSDrtq438g51iq8omQlEnYJfHoiAFxYQGko6bCPSmZ5wS+TRx0Zc5R4CtmHbEVJT+0p1uOYdNE1SMfOKNO0zXWEmItptApsfYa1LV0UZUPIHSCmlRYJhfokNWhX5IcsmIWbEAMCQWerWirhZK57MghNQyzgke3QuQWPUv4EAac9wCuJjmkNmvUNEwiobX+DgdEWoQGgNDPGtTWWhRRWONX5JlnePCZhP1JUCOzPN1O0C2MohP7xuiko8Qy9INUDBg2YPJMlzP8pRv0qYeUdu+Cy+RAKIYmtVqojM5kkS0DwkXlLuY0ICzgAEOlAd8fPe+rYJdppz61TiZ5G4AgcScWz05RcUtAkOwyJMtI4FzNt3suCWKfwLUhdqRC0yA/enB1CZ4vBZ2fhIptJ4x/5PYVavyzQ39N0V8ddnsQ+m3sfX02hjo3bIVJ7d5PhqojZxYdC3NEdv9oQMQWFFjHHqpLEsc9BZyF23c9cG0ZOJjUIN15V1mY8OOAhW0E77yWaP2eoO9VBFG/d6yX6/xuHT2z3AsQ5ImnjrZBF6XcUiKAEl0RlJzZ7ZtnbxmqSgRqfxmyD9k6wNDGzuExecB3Z1/ukBOjQH73MZbspChFp9nQ/EYY9+LaaIYOqlo7JjwISX+LcBwbjAOz2ZKS7BpOcq0o0R2HvZAbHpHPJGc+dm00paQuedmOA4O0WD5fyQ4V08Ip4ATxhYl8CCh76/0QLVyehlBVFyCpYJTcKmPjHoY8XNE2VQ8dbIkdr4Z95npBwcNVahKzNEMBSYSyz46iLm8sLunreG5O+xYTsaMUHYu6bMn79sRCT2+8l6SMV2cCT5e3UspBXbbd9n3nDIN/Q1KP3JDfWLcd8kZwCVX12hjeOlmOIMe+L6FGjJLC4QS5rz6hg/tThjZiU0Pr/g7D65/uCUafKgaUJu0lHjvox/XsjXA+GAOQUogIXV8/v7GoKOGJfYuHxvHjt7t3rEMHD2+E5PoR+5GCLCS+8g6Z2xgGt6anuwGC99MSKAl6RrfUs/ofje+b1PcjlJBlMMk4gKBUe77AqKVP/T1Jj30IQPmCTdkm6NeKb5BkJzCGdCA8XuFGZIOWCBEh/mwGiZ/rFZXk3xHEdkjHb6MknVOhypJe+Sac03XlL4fe3r81mH518q9GyCS3kV8CDADlsrVaJhTLAgAAAABJRU5ErkJggg==";

// @ts-check
/**
 * SafeAnchor - In all ways similar to a regular anchor tag.
 * The difference is that it sanitizes the href value and prevents XSS
 * @type {React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>>}
 */

var SafeAnchor = function SafeAnchor(_ref) {
  var href = _ref.href,
      children = _ref.children,
      target = _ref.target,
      className = _ref.className;
  if (!href) return null;
  var sanitized = sanitizeUrl(href);
  return /*#__PURE__*/React.createElement("a", {
    href: sanitized,
    target: target,
    className: className
  }, children);
};

var SafeAnchor$1 = /*#__PURE__*/React.memo(SafeAnchor);

/**
 * Card - Simple Card Layout
 *
 * @example ../../docs/Card.md
 * @typedef {import('../types').CardProps} Props
 * @type React.FC<Props>
 */

var Card = function Card(_ref) {
  var title = _ref.title,
      title_link = _ref.title_link,
      og_scrape_url = _ref.og_scrape_url,
      image_url = _ref.image_url,
      thumb_url = _ref.thumb_url,
      text = _ref.text,
      type = _ref.type;

  var _useContext = useContext(TranslationContext),
      t = _useContext.t;

  var image = thumb_url || image_url;
  /** @type {(url?: string) => string | null} Typescript syntax */

  var trimUrl = function trimUrl(url) {
    if (url !== undefined && url !== null) {
      var _url$replace$split = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/'),
          _url$replace$split2 = _slicedToArray(_url$replace$split, 1),
          trimmedUrl = _url$replace$split2[0];

      return trimmedUrl;
    }

    return null;
  };

  if (!title && !title_link && !image) {
    return /*#__PURE__*/React.createElement("div", {
      className: "str-chat__message-attachment-card str-chat__message-attachment-card--".concat(type)
    }, /*#__PURE__*/React.createElement("div", {
      className: "str-chat__message-attachment-card--content"
    }, /*#__PURE__*/React.createElement("div", {
      className: "str-chat__message-attachment-card--text"
    }, t('this content could not be displayed'))));
  }

  if (!title_link && !og_scrape_url) {
    return null;
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "str-chat__message-attachment-card str-chat__message-attachment-card--".concat(type)
  }, image && /*#__PURE__*/React.createElement("div", {
    className: "str-chat__message-attachment-card--header"
  }, /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: image
  })), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__message-attachment-card--content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__message-attachment-card--flex"
  }, title && /*#__PURE__*/React.createElement("div", {
    className: "str-chat__message-attachment-card--title"
  }, title), text && /*#__PURE__*/React.createElement("div", {
    className: "str-chat__message-attachment-card--text"
  }, text), (title_link || og_scrape_url) && /*#__PURE__*/React.createElement(SafeAnchor$1, {
    href: title_link || og_scrape_url,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "str-chat__message-attachment-card--url"
  }, trimUrl(title_link || og_scrape_url))), type === 'giphy' && /*#__PURE__*/React.createElement("img", {
    className: "str-chat__message-attachment-card__giphy-logo",
    "data-testid": "card-giphy",
    src: giphyLogo,
    alt: "giphy logo"
  })));
};

Card.propTypes = {
  /** Title returned by the OG scraper */
  title: PropTypes.string,

  /** Link returned by the OG scraper */
  title_link: PropTypes.string,

  /** The scraped url, used as a fallback if the OG-data doesn't include a link */
  og_scrape_url: PropTypes.string,

  /** The url of the full sized image */
  image_url: PropTypes.string,

  /** The url for thumbnail sized image */
  thumb_url: PropTypes.string,

  /** Description returned by the OG scraper */
  text: PropTypes.string
};
var DefaultCard = /*#__PURE__*/React.memo(Card);

/** @type React.FC<import('../types').FileAttachmentProps> */

var FileAttachment = function FileAttachment(_ref) {
  var attachment = _ref.attachment;
  return /*#__PURE__*/React.createElement("div", {
    "data-testid": "attachment-file",
    className: "str-chat__message-attachment-file--item"
  }, /*#__PURE__*/React.createElement(FileIcon, {
    mimeType: attachment.mime_type,
    filename: attachment.title,
    big: true,
    size: 30
  }), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__message-attachment-file--item-text"
  }, /*#__PURE__*/React.createElement(SafeAnchor$1, {
    href: attachment.asset_url,
    target: "_blank",
    download: true
  }, attachment.title), attachment.file_size && Number.isFinite(Number(attachment.file_size)) && /*#__PURE__*/React.createElement("span", null, prettybytes(attachment.file_size))));
};

var DefaultFile = /*#__PURE__*/React.memo(FileAttachment);

// @ts-check
/**
 * Modal - Custom Image component used in modal
 * @type {React.FC<import('../types').ModalImageProps>}
 */

var ModalImage = function ModalImage(_ref) {
  var data = _ref.data;
  return /*#__PURE__*/React.createElement("div", {
    className: "str-chat__modal-image__wrapper",
    "data-testid": "modal-image"
  }, /*#__PURE__*/React.createElement("img", {
    src: data.src,
    className: "str-chat__modal-image__image"
  }));
};

ModalImage.propTypes = {
  data: PropTypes.shape({
    src: PropTypes.string.isRequired
  }).isRequired
};

// @ts-check
/**
 * ImageModal - Small modal component
 * @type { React.FC<import('../types').ModalWrapperProps>}
 */

var ModalComponent = function ModalComponent(_ref) {
  var images = _ref.images,
      toggleModal = _ref.toggleModal,
      index = _ref.index,
      modalIsOpen = _ref.modalIsOpen;
  return /*#__PURE__*/React.createElement(ModalGateway, null, modalIsOpen ?
  /*#__PURE__*/
  // @ts-expect-error
  React.createElement(Modal$1, {
    onClose: toggleModal
  }, /*#__PURE__*/React.createElement(Carousel, {
    views: images,
    currentIndex: index,
    components: {
      // @ts-expect-error
      View: ModalImage
    }
  })) : null);
};

ModalComponent.propTypes = {
  images: PropTypes.array.isRequired,
  toggleModal: PropTypes.func.isRequired,
  index: PropTypes.number,
  modalIsOpen: PropTypes.bool.isRequired
};

/**
 * Gallery - displays up to 4 images in a simple responsive grid with a lightbox to view the images.
 * @example ../../docs/Gallery.md
 * @typedef {import('../types').GalleryProps} Props
 * @type React.FC<Props>
 */

var Gallery = function Gallery(_ref) {
  var images = _ref.images;

  var _useState = useState(0),
      _useState2 = _slicedToArray(_useState, 2),
      index = _useState2[0],
      setIndex = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      modalOpen = _useState4[0],
      setModalOpen = _useState4[1];

  var _useContext = useContext(TranslationContext),
      t = _useContext.t;
  /**
   * @param {number} selectedIndex Index of image clicked
   */


  var toggleModal = function toggleModal(selectedIndex) {
    if (modalOpen) {
      setModalOpen(false);
    } else {
      setIndex(selectedIndex);
      setModalOpen(true);
    }
  };

  var formattedArray = useMemo(function () {
    return images.map(function (image) {
      return {
        src: image.image_url || image.thumb_url || '',
        source: image.image_url || image.thumb_url || ''
      };
    });
  }, [images]);
  var renderImages = images.slice(0, 3).map(function (image, i) {
    return /*#__PURE__*/React.createElement("div", {
      "data-testid": "gallery-image",
      className: "str-chat__gallery-image",
      key: "gallery-image-".concat(i),
      onClick: function onClick() {
        return toggleModal(i);
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: image.image_url || image.thumb_url
    }));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "str-chat__gallery ".concat(images.length > 3 ? 'str-chat__gallery--square' : '')
  }, renderImages, images.length > 3 && /*#__PURE__*/React.createElement("div", {
    className: "str-chat__gallery-placeholder",
    style: {
      backgroundImage: "url(".concat(images[3].image_url, ")")
    },
    onClick: function onClick() {
      return toggleModal(3);
    }
  }, /*#__PURE__*/React.createElement("p", null, t('{{ imageCount }} more', {
    imageCount: images.length - 3
  }))), /*#__PURE__*/React.createElement(ModalComponent, {
    images: formattedArray,
    index: index // @ts-expect-error
    ,
    toggleModal: toggleModal,
    modalIsOpen: modalOpen
  }));
};

Gallery.propTypes = {
  images:
  /** @type { PropTypes.Validator<import('../types').GalleryProps['images']> } */
  PropTypes.arrayOf(PropTypes.object.isRequired).isRequired
};
var Gallery$1 = /*#__PURE__*/React.memo(Gallery);

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
/**
 * Image - Small wrapper around an image tag, supports thumbnails
 *
 * @example ../../docs/Image.md
 * @extends {React.PureComponent<import('type').ImageProps>}
 */

var ImageComponent = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(ImageComponent, _React$PureComponent);

  var _super = _createSuper(ImageComponent);

  function ImageComponent() {
    var _this;

    _classCallCheck(this, ImageComponent);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      modalIsOpen: false,
      currentIndex: 0
    });

    _defineProperty(_assertThisInitialized(_this), "toggleModal", function () {
      _this.setState(function (state) {
        return {
          modalIsOpen: !state.modalIsOpen
        };
      });
    });

    return _this;
  }

  _createClass(ImageComponent, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          image_url = _this$props.image_url,
          thumb_url = _this$props.thumb_url,
          fallback = _this$props.fallback;
      var imageSrc = sanitizeUrl(image_url || thumb_url);
      var formattedArray = [{
        src: imageSrc
      }];
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("img", {
        className: "str-chat__message-attachment--img",
        onClick: this.toggleModal,
        src: imageSrc,
        alt: fallback,
        "data-testid": "image-test"
      }), /*#__PURE__*/React.createElement(ModalComponent, {
        images: formattedArray,
        toggleModal: this.toggleModal,
        index: this.state.currentIndex,
        modalIsOpen: this.state.modalIsOpen
      }));
    }
  }]);

  return ImageComponent;
}(React.PureComponent);

_defineProperty(ImageComponent, "propTypes", {
  /** The full size image url */
  image_url: PropTypes.string,

  /** The thumb url */
  thumb_url: PropTypes.string,

  /** The text fallback for the image */
  fallback: PropTypes.string
});

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var SUPPORTED_VIDEO_FORMATS = ['video/mp4', 'video/ogg', 'video/webm', 'video/quicktime'];
/**
 * @typedef {import('../types').ExtendedAttachment} ExtendedAttachment
 * @typedef {Required<Pick<import('../types').InnerAttachmentUIComponentProps, 'Card' | 'File' | 'Gallery' |'Image' | 'Audio' | 'Media' | 'AttachmentActions'>>} DefaultProps
 * @typedef {Omit<import('../types').InnerAttachmentUIComponentProps, 'Card' | 'File' | 'Image'| 'Gallery' | 'Audio' | 'Media' | 'AttachmentActions'> & DefaultProps} AttachmentProps
 */

/**
 * @param {ExtendedAttachment} a
 */

var isGalleryAttachment = function isGalleryAttachment(a) {
  return a.type === 'gallery';
};
/**
 * @param {ExtendedAttachment} a
 */

var isImageAttachment = function isImageAttachment(a) {
  return a.type === 'image' && !a.title_link && !a.og_scrape_url;
};
/**
 * @param {ExtendedAttachment} a
 */

var isMediaAttachment = function isMediaAttachment(a) {
  return a.mime_type && SUPPORTED_VIDEO_FORMATS.indexOf(a.mime_type) !== -1 || a.type === 'video';
};
/**
 * @param {ExtendedAttachment} a
 */

var isAudioAttachment = function isAudioAttachment(a) {
  return a.type === 'audio';
};
/**
 * @param {ExtendedAttachment} a
 */

var isFileAttachment = function isFileAttachment(a) {
  return a.type === 'file' || a.mime_type && SUPPORTED_VIDEO_FORMATS.indexOf(a.mime_type) === -1 && a.type !== 'video';
};
/**
 * @param {React.ReactNode} children
 * @param {ExtendedAttachment} attachment
 * @param {string} componentType
 */

var renderAttachmentWithinContainer = function renderAttachmentWithinContainer(children, attachment, componentType) {
  var extra = attachment && attachment.actions && attachment.actions.length ? 'actions' : '';

  if (componentType === 'card' && !attachment.image_url && !attachment.thumb_url) {
    extra = 'no-image';
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "str-chat__message-attachment str-chat__message-attachment--".concat(componentType, " str-chat__message-attachment--").concat(attachment.type, " str-chat__message-attachment--").concat(componentType, "--").concat(extra),
    key: "".concat(attachment === null || attachment === void 0 ? void 0 : attachment.id, "-").concat(attachment.type || 'none', " ")
  }, children);
};
/**
 * @param {AttachmentProps} props
 */

var renderAttachmentActions = function renderAttachmentActions(props) {
  var a = props.attachment,
      AttachmentActions = props.AttachmentActions,
      actionHandler = props.actionHandler;

  if (!a.actions || !a.actions.length) {
    return null;
  }

  return /*#__PURE__*/React.createElement(AttachmentActions, _extends({}, a, {
    id: a.id || '',
    actions: a.actions || [],
    text: a.text || '',
    key: "key-actions-".concat(a.id),
    actionHandler: actionHandler
  }));
};
/**
 * @param {AttachmentProps} props
 */

var renderGallery = function renderGallery(props) {
  var a = props.attachment,
      Gallery = props.Gallery;
  return renderAttachmentWithinContainer( /*#__PURE__*/React.createElement(Gallery, {
    images: a.images || [],
    key: "gallery"
  }), a, 'gallery');
};
/**
 * @param {AttachmentProps} props
 */

var renderImage = function renderImage(props) {
  var a = props.attachment,
      Image = props.Image;

  if (a.actions && a.actions.length) {
    return renderAttachmentWithinContainer( /*#__PURE__*/React.createElement("div", {
      className: "str-chat__attachment",
      key: "key-image-".concat(a.id)
    }, /*#__PURE__*/React.createElement(Image, a), renderAttachmentActions(props)), a, 'image');
  }

  return renderAttachmentWithinContainer( /*#__PURE__*/React.createElement(Image, _extends({}, a, {
    key: "key-image-".concat(a.id)
  })), a, 'image');
};
/**
 * @param {AttachmentProps} props
 */

var renderCard = function renderCard(props) {
  var a = props.attachment,
      Card = props.Card;

  if (a.actions && a.actions.length) {
    return renderAttachmentWithinContainer( /*#__PURE__*/React.createElement("div", {
      className: "str-chat__attachment",
      key: "key-image-".concat(a.id)
    }, /*#__PURE__*/React.createElement(Card, _extends({}, a, {
      key: "key-card-".concat(a.id)
    })), renderAttachmentActions(props)), a, 'card');
  }

  return renderAttachmentWithinContainer( /*#__PURE__*/React.createElement(Card, _extends({}, a, {
    key: "key-card-".concat(a.id)
  })), a, 'card');
};
/**
 * @param {AttachmentProps} props
 */

var renderFile = function renderFile(props) {
  var a = props.attachment,
      File = props.File;
  if (!a.asset_url) return null;
  return renderAttachmentWithinContainer( /*#__PURE__*/React.createElement(File, {
    attachment: a,
    key: "key-file-".concat(a.id)
  }), a, 'file');
};
/**
 * @param {AttachmentProps} props
 */

var renderAudio = function renderAudio(props) {
  var a = props.attachment,
      Audio = props.Audio;
  return renderAttachmentWithinContainer( /*#__PURE__*/React.createElement("div", {
    className: "str-chat__attachment",
    key: "key-video-".concat(a.id)
  }, /*#__PURE__*/React.createElement(Audio, {
    og: a
  })), a, 'audio');
};
/**
 * @param {AttachmentProps} props
 */

var renderMedia = function renderMedia(props) {
  var a = props.attachment,
      Media = props.Media;

  if (a.actions && a.actions.length) {
    return renderAttachmentWithinContainer( /*#__PURE__*/React.createElement("div", {
      className: "str-chat__attachment str-chat__attachment-media",
      key: "key-video-".concat(a.id)
    }, /*#__PURE__*/React.createElement("div", {
      className: "str-chat__player-wrapper"
    }, /*#__PURE__*/React.createElement(Media, {
      className: "react-player",
      url: a.asset_url,
      width: "100%",
      height: "100%",
      controls: true
    })), renderAttachmentActions(props)), a, 'media');
  }

  return renderAttachmentWithinContainer( /*#__PURE__*/React.createElement("div", {
    className: "str-chat__player-wrapper",
    key: "key-video-".concat(a.id)
  }, /*#__PURE__*/React.createElement(Media, {
    className: "react-player",
    url: a.asset_url,
    width: "100%",
    height: "100%",
    controls: true
  })), a, 'media');
};
/**
 * Attachment - The message attachment
 *
 * @example ../../docs/Attachment.md
 * @type { React.FC<import('../types').WrapperAttachmentUIComponentProps> }
 */

var Attachment = function Attachment(_ref) {
  var _gallery$images, _newAttachments;

  var attachments = _ref.attachments,
      _ref$Card = _ref.Card,
      Card = _ref$Card === void 0 ? DefaultCard : _ref$Card,
      _ref$Image = _ref.Image,
      Image = _ref$Image === void 0 ? ImageComponent : _ref$Image,
      _ref$Gallery = _ref.Gallery,
      Gallery = _ref$Gallery === void 0 ? Gallery$1 : _ref$Gallery,
      _ref$Audio = _ref.Audio,
      Audio = _ref$Audio === void 0 ? DefaultAudio : _ref$Audio,
      _ref$File = _ref.File,
      File = _ref$File === void 0 ? DefaultFile : _ref$File,
      _ref$Media = _ref.Media,
      Media = _ref$Media === void 0 ? DefaultMedia : _ref$Media,
      _ref$AttachmentAction = _ref.AttachmentActions,
      AttachmentActions = _ref$AttachmentAction === void 0 ? DefaultAttachmentActions : _ref$AttachmentAction,
      rest = _objectWithoutProperties(_ref, ["attachments", "Card", "Image", "Gallery", "Audio", "File", "Media", "AttachmentActions"]);

  var gallery = {
    type: 'gallery',
    images: attachments.filter(
    /** @param {import('../types').ExtendedAttachment} a */
    function (a) {
      return a.type === 'image' && !(a.og_scrape_url || a.title_link);
    })
  };
  var newAttachments;

  if (((_gallery$images = gallery.images) === null || _gallery$images === void 0 ? void 0 : _gallery$images.length) >= 2) {
    newAttachments = [].concat(_toConsumableArray(attachments.filter(
    /** @param {import('../types').ExtendedAttachment} a */
    function (a) {
      return !(a.type === 'image' && !(a.og_scrape_url || a.title_link));
    })), [gallery]);
  } else {
    newAttachments = attachments;
  }

  var propsWithDefault = _objectSpread$1({
    Card,
    Image,
    Audio,
    File,
    Media,
    Gallery,
    AttachmentActions,
    attachments: newAttachments
  }, rest);

  return /*#__PURE__*/React.createElement(React.Fragment, null, (_newAttachments = newAttachments) === null || _newAttachments === void 0 ? void 0 : _newAttachments.map(
  /** @param {any} attachment */
  function (attachment) {
    if (isGalleryAttachment(attachment)) {
      return renderGallery(_objectSpread$1(_objectSpread$1({}, propsWithDefault), {}, {
        attachment
      }));
    }

    if (isImageAttachment(attachment)) {
      return renderImage(_objectSpread$1(_objectSpread$1({}, propsWithDefault), {}, {
        attachment
      }));
    }

    if (isFileAttachment(attachment)) {
      return renderFile(_objectSpread$1(_objectSpread$1({}, propsWithDefault), {}, {
        attachment
      }));
    }

    if (isAudioAttachment(attachment)) {
      return renderAudio(_objectSpread$1(_objectSpread$1({}, propsWithDefault), {}, {
        attachment
      }));
    }

    if (isMediaAttachment(attachment)) {
      return renderMedia(_objectSpread$1(_objectSpread$1({}, propsWithDefault), {}, {
        attachment
      }));
    }

    return renderCard(_objectSpread$1(_objectSpread$1({}, propsWithDefault), {}, {
      attachment
    }));
  }));
};

Attachment.propTypes = {
  /**
   * The attachment to render
   * @see See [Attachment structure](https://getstream.io/chat/docs/#message_format)
   *
   *  */
  attachments:
  /** @type {PropTypes.Validator<ExtendedAttachment[]>} */
  PropTypes.array.isRequired,

  /**
   *
   * @param name {string} Name of action
   * @param value {string} Value of action
   * @param event Dom event that triggered this handler
   */
  actionHandler: PropTypes.func,

  /**
   * Custom UI component for card type attachment
   * Defaults to [Card](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/Card.js)
   */
  Card:
  /** @type {PropTypes.Validator<React.ComponentType<import('../types').CardProps>>} */
  PropTypes.elementType,

  /**
   * Custom UI component for file type attachment
   * Defaults to [File](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/File.js)
   */
  File:
  /** @type {PropTypes.Validator<React.ComponentType<import('../types').FileAttachmentProps>>} */
  PropTypes.elementType,

  /**
   * Custom UI component for attachment actions
   * Defaults to [AttachmentActions](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/AttachmentActions.js)
   */
  Gallery:
  /** @type {PropTypes.Validator<React.ComponentType<import('../types').GalleryProps>>} */
  PropTypes.elementType,

  /**
   * Custom UI component for image type attachment
   * Defaults to [Image](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Gallery/Image.js)
   */
  Image:
  /** @type {PropTypes.Validator<React.ComponentType<import('../types').ImageProps>>} */
  PropTypes.elementType,

  /**
   * Custom UI component for audio type attachment
   * Defaults to [Audio](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/Audio.js)
   */
  Audio:
  /** @type {PropTypes.Validator<React.ComponentType<import('../types').AudioProps>>} */
  PropTypes.elementType,

  /**
   * Custom UI component for media type attachment
   * Defaults to [ReactPlayer](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/ReactPlayer.js)
   */
  Media:
  /** @type {PropTypes.Validator<React.ComponentType<import('react-player').ReactPlayerProps>>} */
  PropTypes.elementType,

  /**
   * Custom UI component for attachment actions
   * Defaults to [AttachmentActions](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/AttachmentActions.js)
   */
  AttachmentActions:
  /** @type {PropTypes.Validator<React.ComponentType<import('../types').AttachmentActionsProps>>} */
  PropTypes.elementType
};

/* eslint-disable */
var KEY_CODES = {
  ESC: 27,
  UP: 38,
  DOWN: 40,
  ENTER: 13,
  TAB: 9,
  SPACE: 32
}; // This is self-made key shortcuts manager, used for caching key strokes

var Listener = function Listener() {
  var _this = this;

  _classCallCheck(this, Listener);

  _defineProperty(this, "startListen", function () {
    if (!_this.refCount) {
      // prevent multiple listeners in case of multiple TextareaAutocomplete components on page
      document.addEventListener('keydown', _this.f);
    }

    _this.refCount++;
  });

  _defineProperty(this, "stopListen", function () {
    _this.refCount--;

    if (!_this.refCount) {
      // prevent disable listening in case of multiple TextareaAutocomplete components on page
      document.removeEventListener('keydown', _this.f);
    }
  });

  _defineProperty(this, "add", function (keyCodes, fn) {
    var keyCode = keyCodes;
    if (typeof keyCode !== 'object') keyCode = [keyCode];
    _this.listeners[_this.index] = {
      keyCode,
      fn
    };
    _this.index += 1;
    return _this.index;
  });

  _defineProperty(this, "remove", function (id) {
    delete _this.listeners[id];
  });

  _defineProperty(this, "removeAll", function () {
    _this.listeners = {};
    _this.index = 0;
  });

  this.index = 0;
  this.listeners = {};
  this.refCount = 0;

  this.f = function (e) {
    var code = e.keyCode || e.which;
    Object.values(_this.listeners).forEach(function (_ref) {
      var keyCode = _ref.keyCode,
          fn = _ref.fn;
      if (keyCode.includes(code)) fn(e);
    });
  };
};

var Listeners = new Listener();

var Item = /*#__PURE__*/React.forwardRef(function (props, innerRef) {
  var className = props.className,
      Component = props.component,
      item = props.item,
      onClickHandler = props.onClickHandler,
      onSelectHandler = props.onSelectHandler,
      selected = props.selected,
      style = props.style;

  var selectItem = function selectItem() {
    return onSelectHandler(item);
  };

  return /*#__PURE__*/React.createElement("li", {
    className: "rta__item ".concat(className || ''),
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: "rta__entity ".concat(selected ? 'rta__entity--selected' : ''),
    onClick: onClickHandler,
    onFocus: selectItem,
    onMouseEnter: selectItem,
    ref: innerRef,
    role: "button",
    tabIndex: 0
  }, /*#__PURE__*/React.createElement(Component, {
    selected: selected,
    entity: item
  })));
});

var List = function List(props) {
  var className = props.className,
      component = props.component,
      dropdownScroll = props.dropdownScroll,
      getSelectedItem = props.getSelectedItem,
      getTextToReplace = props.getTextToReplace,
      itemClassName = props.itemClassName,
      itemStyle = props.itemStyle,
      onSelect = props.onSelect,
      style = props.style,
      propValue = props.value,
      values = props.values;

  var _useContext = useContext(TranslationContext),
      t = _useContext.t;

  var _useState = useState(undefined),
      _useState2 = _slicedToArray(_useState, 2),
      selectedItem = _useState2[0],
      setSelectedItem = _useState2[1];

  var itemsRef = {};

  var isSelected = function isSelected(item) {
    return selectedItem === values.indexOf(item);
  };

  var getId = function getId(item) {
    var textToReplace = getTextToReplace(item);

    if (textToReplace.key) {
      return textToReplace.key;
    }

    if (typeof item === 'string' || !item.key) {
      return textToReplace.text;
    }

    return item.key;
  };

  var modifyText = function modifyText(value) {
    if (!value) return;
    onSelect(getTextToReplace(value));
    if (getSelectedItem) getSelectedItem(value);
  };

  var handleClick = function handleClick(e) {
    var _e$preventDefault;

    if (e) (_e$preventDefault = e.preventDefault) === null || _e$preventDefault === void 0 ? void 0 : _e$preventDefault.call(e);
    modifyText(values[selectedItem]);
  };

  var selectItem = function selectItem(item) {
    var keyboard = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    setSelectedItem(values.indexOf(item));
    if (keyboard) dropdownScroll(itemsRef[getId(item)]);
  };

  var handleKeyDown = useCallback(function (event) {
    if (event.which === KEY_CODES.UP) {
      setSelectedItem(function (prevSelected) {
        if (prevSelected === undefined) return 0;
        return prevSelected === 0 ? values.length - 1 : prevSelected - 1;
      });
    }

    if (event.which === KEY_CODES.DOWN) {
      setSelectedItem(function (prevSelected) {
        if (prevSelected === undefined) return 0;
        return prevSelected === values.length - 1 ? 0 : prevSelected + 1;
      });
    }

    if ((event.which === KEY_CODES.ENTER || event.which === KEY_CODES.TAB) && selectedItem !== undefined) {
      handleClick(event);
      return setSelectedItem(undefined);
    }

    return null;
  }, [selectedItem, values] // eslint-disable-line
  );
  useEffect(function () {
    document.addEventListener('keydown', handleKeyDown, false);
    return function () {
      return document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  useEffect(function () {
    if (values !== null && values !== void 0 && values.length) selectItem(values[0]);
  }, [values]); // eslint-disable-line

  var renderHeader = function renderHeader(value) {
    if (value[0] === '/') {
      var html = "<strong>".concat(value.replace('/', ''), "</strong>");
      return "".concat(t('Commands matching'), " ").concat(html);
    }

    if (value[0] === ':') {
      var _html = "<strong>".concat(value.replace(':', ''), "</strong>");

      return "".concat(t('Emoji matching'), " ").concat(_html);
    }

    if (value[0] === '@') {
      var _html2 = "<strong>".concat(value.replace('@', ''), "</strong>");

      return "".concat(t('People matching'), " ").concat(_html2);
    }

    return null;
  };

  return /*#__PURE__*/React.createElement("ul", {
    className: "rta__list ".concat(className || ''),
    style: style
  }, /*#__PURE__*/React.createElement("li", {
    className: "rta__list-header",
    dangerouslySetInnerHTML: {
      __html: renderHeader(propValue)
    }
  }), values.map(function (item) {
    return /*#__PURE__*/React.createElement(Item, {
      className: itemClassName,
      component: component,
      item: item,
      key: getId(item),
      onClickHandler: handleClick,
      onSelectHandler: selectItem,
      ref: function ref(_ref) {
        itemsRef[getId(item)] = _ref;
      },
      selected: isSelected(item),
      style: itemStyle
    });
  }));
};

var DEFAULT_CARET_POSITION = 'next';
function defaultScrollToItem(container, item) {
  if (!item) return;
  var itemHeight = parseInt(getComputedStyle(item).getPropertyValue('height'), 10);
  var containerHight = parseInt(getComputedStyle(container).getPropertyValue('height'), 10) - itemHeight;
  var actualScrollTop = container.scrollTop;
  var itemOffsetTop = item.offsetTop;

  if (itemOffsetTop < actualScrollTop + containerHight && actualScrollTop < itemOffsetTop) {
    return;
  } // eslint-disable-next-line


  container.scrollTop = itemOffsetTop;
}
var errorMessage = function errorMessage(message) {
  return console.error("RTA: dataProvider fails: ".concat(message, "\n    \nCheck the documentation or create issue if you think it's bug. https://github.com/webscopeio/react-textarea-autocomplete/issues"));
};
var triggerPropsCheck = function triggerPropsCheck(_ref) {
  var trigger = _ref.trigger;
  if (!trigger) return Error('Invalid prop trigger. Prop missing.');
  var triggers = Object.entries(trigger);

  for (var i = 0; i < triggers.length; i += 1) {
    var _triggers$i = _slicedToArray(triggers[i], 2),
        triggerChar = _triggers$i[0],
        settings = _triggers$i[1];

    if (typeof triggerChar !== 'string' || triggerChar.length !== 1) {
      return Error('Invalid prop trigger. Keys of the object has to be string / one character.');
    } // $FlowFixMe


    var triggerSetting = settings;
    var component = triggerSetting.component,
        dataProvider = triggerSetting.dataProvider,
        output = triggerSetting.output,
        callback = triggerSetting.callback;

    if (!isValidElementType(component)) {
      return Error('Invalid prop trigger: component should be defined.');
    }

    if (!dataProvider || typeof dataProvider !== 'function') {
      return Error('Invalid prop trigger: dataProvider should be defined.');
    }

    if (output && typeof output !== 'function') {
      return Error('Invalid prop trigger: output should be a function.');
    }

    if (callback && typeof callback !== 'function') {
      return Error('Invalid prop trigger: callback should be a function.');
    }
  }

  return null;
};

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var ReactTextareaAutocomplete = /*#__PURE__*/function (_React$Component) {
  _inherits(ReactTextareaAutocomplete, _React$Component);

  var _super = _createSuper$1(ReactTextareaAutocomplete);

  function ReactTextareaAutocomplete(_props) {
    var _this;

    _classCallCheck(this, ReactTextareaAutocomplete);

    _this = _super.call(this, _props);

    _defineProperty(_assertThisInitialized(_this), "getSelectionPosition", function () {
      if (!_this.textareaRef) return null;
      return {
        selectionStart: _this.textareaRef.selectionStart,
        selectionEnd: _this.textareaRef.selectionEnd
      };
    });

    _defineProperty(_assertThisInitialized(_this), "getSelectedText", function () {
      if (!_this.textareaRef) return null;
      var _this$textareaRef = _this.textareaRef,
          selectionStart = _this$textareaRef.selectionStart,
          selectionEnd = _this$textareaRef.selectionEnd;
      if (selectionStart === selectionEnd) return null;
      return _this.state.value.substr(selectionStart, selectionEnd - selectionStart);
    });

    _defineProperty(_assertThisInitialized(_this), "setCaretPosition", function () {
      var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      if (!_this.textareaRef) return;

      _this.textareaRef.focus();

      _this.textareaRef.setSelectionRange(position, position);
    });

    _defineProperty(_assertThisInitialized(_this), "getCaretPosition", function () {
      if (!_this.textareaRef) return 0;
      return _this.textareaRef.selectionEnd;
    });

    _defineProperty(_assertThisInitialized(_this), "_onEnter", function (event) {
      if (!_this.textareaRef) return;
      var trigger = _this.state.currentTrigger;

      var hasFocus = _this.textareaRef.matches(':focus'); // don't submit if the element has focus or the shift key is pressed


      if (!hasFocus || event.shiftKey === true) return;

      if (!trigger || !_this.state.data) {
        // trigger a submit
        _this._replaceWord();

        if (_this.textareaRef) {
          _this.textareaRef.selectionEnd = 0;
        }

        _this.props.handleSubmit(event);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_onSpace", function () {
      if (!_this.props.replaceWord || !_this.textareaRef) return; // don't change characters if the element doesn't have focus

      var hasFocus = _this.textareaRef.matches(':focus');

      if (!hasFocus) return;

      _this._replaceWord();
    });

    _defineProperty(_assertThisInitialized(_this), "_replaceWord", function () {
      var value = _this.state.value;
      var lastWordRegex = /([^\s]+)(\s*)$/;
      var match = lastWordRegex.exec(value.slice(0, _this.getCaretPosition()));
      var lastWord = match && match[1];
      if (!lastWord) return;
      var spaces = match[2];

      var newWord = _this.props.replaceWord(lastWord);

      if (newWord == null) return;
      var textBeforeWord = value.slice(0, _this.getCaretPosition() - match[0].length);
      var textAfterCaret = value.slice(_this.getCaretPosition(), -1);
      var newText = textBeforeWord + newWord + spaces + textAfterCaret;

      _this.setState({
        value: newText
      }, function () {
        // fire onChange event after successful selection
        var e = new CustomEvent('change', {
          bubbles: true
        });

        _this.textareaRef.dispatchEvent(e);

        if (_this.props.onChange) _this.props.onChange(e);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "_onSelect", function (newToken) {
      var onChange = _this.props.onChange;
      var _this$state = _this.state,
          currentTrigger = _this$state.currentTrigger,
          selectionEnd = _this$state.selectionEnd,
          textareaValue = _this$state.value;
      if (!currentTrigger) return;

      var computeCaretPosition = function computeCaretPosition(position, token, startToken) {
        switch (position) {
          case 'start':
            return startToken;

          case 'next':
          case 'end':
            return startToken + token.length;

          default:
            if (!Number.isInteger(position)) {
              throw new Error('RTA: caretPosition should be "start", "next", "end" or number.');
            }

            return position;
        }
      };

      var textToModify = textareaValue.slice(0, selectionEnd);
      var startOfTokenPosition = textToModify.search(
      /**
       * It's important to escape the currentTrigger char for chars like [, (,...
       */
      new RegExp("\\".concat(currentTrigger, "[^\\".concat(currentTrigger, '\\s', "]"), "*$"))); // we add space after emoji is selected if a caret position is next

      var newTokenString = newToken.caretPosition === 'next' ? "".concat(newToken.text, " ") : newToken.text;
      var newCaretPosition = computeCaretPosition(newToken.caretPosition, newTokenString, startOfTokenPosition);
      var modifiedText = textToModify.substring(0, startOfTokenPosition) + newTokenString; // set the new textarea value and after that set the caret back to its position

      _this.setState({
        value: textareaValue.replace(textToModify, modifiedText),
        dataLoading: false
      }, function () {
        // fire onChange event after successful selection
        var e = new CustomEvent('change', {
          bubbles: true
        });

        _this.textareaRef.dispatchEvent(e);

        if (onChange) onChange(e);

        _this.setCaretPosition(newCaretPosition);
      });

      _this._closeAutocomplete();
    });

    _defineProperty(_assertThisInitialized(_this), "_getItemOnSelect", function () {
      var currentTrigger = _this.state.currentTrigger;

      var triggerSettings = _this._getCurrentTriggerSettings();

      if (!currentTrigger || !triggerSettings) return null;
      var callback = triggerSettings.callback;
      if (!callback) return null;
      return function (item) {
        if (typeof callback !== 'function') {
          throw new Error('Output functor is not defined! You have to define "output" function. https://github.com/webscopeio/react-textarea-autocomplete#trigger-type');
        }

        if (callback) {
          return callback(item, currentTrigger);
        }

        return null;
      };
    });

    _defineProperty(_assertThisInitialized(_this), "_getTextToReplace", function () {
      var _this$state2 = _this.state,
          actualToken = _this$state2.actualToken,
          currentTrigger = _this$state2.currentTrigger;

      var triggerSettings = _this._getCurrentTriggerSettings();

      if (!currentTrigger || !triggerSettings) return null;
      var output = triggerSettings.output;
      return function (item) {
        if (typeof item === 'object' && (!output || typeof output !== 'function')) {
          throw new Error('Output functor is not defined! If you are using items as object you have to define "output" function. https://github.com/webscopeio/react-textarea-autocomplete#trigger-type');
        }

        if (output) {
          var textToReplace = output(item, currentTrigger);

          if (!textToReplace || typeof textToReplace === 'number') {
            throw new Error("Output functor should return string or object in shape {text: string, caretPosition: string | number}.\nGot \"".concat(String(textToReplace), "\". Check the implementation for trigger \"").concat(currentTrigger, "\" and its token \"").concat(actualToken, "\"\n\nSee https://github.com/webscopeio/react-textarea-autocomplete#trigger-type for more informations.\n"));
          }

          if (typeof textToReplace === 'string') {
            return {
              text: textToReplace,
              caretPosition: DEFAULT_CARET_POSITION
            };
          }

          if (!textToReplace.text) {
            throw new Error("Output \"text\" is not defined! Object should has shape {text: string, caretPosition: string | number}. Check the implementation for trigger \"".concat(currentTrigger, "\" and its token \"").concat(actualToken, "\"\n"));
          }

          if (!textToReplace.caretPosition) {
            throw new Error("Output \"caretPosition\" is not defined! Object should has shape {text: string, caretPosition: string | number}. Check the implementation for trigger \"".concat(currentTrigger, "\" and its token \"").concat(actualToken, "\"\n"));
          }

          return textToReplace;
        }

        if (typeof item !== 'string') {
          throw new Error('Output item should be string\n');
        }

        return {
          caretPosition: DEFAULT_CARET_POSITION,
          text: "".concat(currentTrigger).concat(item).concat(currentTrigger)
        };
      };
    });

    _defineProperty(_assertThisInitialized(_this), "_getCurrentTriggerSettings", function () {
      var currentTrigger = _this.state.currentTrigger;
      if (!currentTrigger) return null;
      return _this.props.trigger[currentTrigger];
    });

    _defineProperty(_assertThisInitialized(_this), "_getValuesFromProvider", function () {
      var _this$state3 = _this.state,
          actualToken = _this$state3.actualToken,
          currentTrigger = _this$state3.currentTrigger;

      var triggerSettings = _this._getCurrentTriggerSettings();

      if (!currentTrigger || !triggerSettings) return;
      var dataProvider = triggerSettings.dataProvider,
          component = triggerSettings.component;

      if (typeof dataProvider !== 'function') {
        throw new Error('Trigger provider has to be a function!');
      }

      _this.setState({
        dataLoading: true
      }); // Modified: send the full text to support / style commands


      dataProvider(actualToken, _this.state.value, function (data, token) {
        // Make sure that the result is still relevant for current query
        if (token !== _this.state.actualToken) return;

        if (!Array.isArray(data)) {
          throw new Error('Trigger provider has to provide an array!');
        }

        if (!isValidElementType(component)) {
          throw new Error('Component should be defined!');
        } // throw away if we resolved old trigger


        if (currentTrigger !== _this.state.currentTrigger) return; // if we haven't resolved any data let's close the autocomplete

        if (!data.length) {
          _this._closeAutocomplete();

          return;
        }

        _this.setState({
          component,
          data,
          dataLoading: false
        });
      });
    });

    _defineProperty(_assertThisInitialized(_this), "_getSuggestions", function () {
      var _this$state4 = _this.state,
          currentTrigger = _this$state4.currentTrigger,
          data = _this$state4.data;
      if (!currentTrigger || !data || data && !data.length) return null;
      return data;
    });

    _defineProperty(_assertThisInitialized(_this), "_createRegExp", function () {
      var trigger = _this.props.trigger; // negative lookahead to match only the trigger + the actual token = "bladhwd:adawd:word test" => ":word"
      // https://stackoverflow.com/a/8057827/2719917

      _this.tokenRegExp = new RegExp("([".concat(Object.keys(trigger).join(''), "])(?:(?!\\1)[^\\s])*$"));
    });

    _defineProperty(_assertThisInitialized(_this), "_closeAutocomplete", function () {
      _this.setState({
        currentTrigger: null,
        data: null,
        dataLoading: false,
        left: null,
        top: null
      });
    });

    _defineProperty(_assertThisInitialized(_this), "_cleanUpProps", function () {
      var props = _objectSpread$2({}, _this.props);

      var notSafe = ['additionalTextareaProps', 'className', 'closeOnClickOutside', 'containerClassName', 'containerStyle', 'disableMentions', 'dropdownClassName', 'dropdownStyle', 'grow', 'handleSubmit', 'innerRef', 'itemClassName', 'itemStyle', 'listClassName', 'listStyle', 'loaderClassName', 'loaderStyle', 'loadingComponent', 'minChar', 'movePopupAsYouType', 'onCaretPositionChange', 'onChange', 'ref', 'replaceWord', 'scrollToItem', 'SuggestionList', 'trigger', 'value']; // eslint-disable-next-line

      for (var prop in props) {
        if (notSafe.includes(prop)) delete props[prop];
      }

      return props;
    });

    _defineProperty(_assertThisInitialized(_this), "_isCommand", function (text) {
      if (text[0] !== '/') return false;
      var tokens = text.split(' ');
      if (tokens.length > 1) return false;
      return true;
    });

    _defineProperty(_assertThisInitialized(_this), "_changeHandler", function (e) {
      var _this$props = _this.props,
          minChar = _this$props.minChar,
          movePopupAsYouType = _this$props.movePopupAsYouType,
          onCaretPositionChange = _this$props.onCaretPositionChange,
          onChange = _this$props.onChange,
          trigger = _this$props.trigger;
      var _this$state5 = _this.state,
          left = _this$state5.left,
          top = _this$state5.top;
      var textarea = e.target;
      var selectionEnd = textarea.selectionEnd,
          selectionStart = textarea.selectionStart,
          value = textarea.value;

      if (onChange) {
        e.persist();
        onChange(e);
      }

      if (onCaretPositionChange) onCaretPositionChange(_this.getCaretPosition());

      _this.setState({
        value
      });

      var currentTrigger;
      var lastToken;

      if (_this._isCommand(value)) {
        currentTrigger = '/';
        lastToken = value;
      } else {
        var tokenMatch = value.slice(0, selectionEnd).match(/(?!^|\W)?[:@][^\s]*\s?[^\s]*$/g);
        lastToken = tokenMatch && tokenMatch[tokenMatch.length - 1].trim();
        currentTrigger = lastToken && Object.keys(trigger).find(function (a) {
          return a === lastToken[0];
        }) || null;
      }
      /*
       if we lost the trigger token or there is no following character we want to close
       the autocomplete
      */


      if (!lastToken || lastToken.length <= minChar) {
        _this._closeAutocomplete();

        return;
      }

      var actualToken = lastToken.slice(1); // if trigger is not configured step out from the function, otherwise proceed

      if (!currentTrigger) return;

      if (movePopupAsYouType || top === null && left === null || // if we have single char - trigger it means we want to re-position the autocomplete
      lastToken.length === 1) {
        var _getCaretCoordinates = getCaretCoordinates(textarea, selectionEnd),
            newTop = _getCaretCoordinates.top,
            newLeft = _getCaretCoordinates.left;

        _this.setState({
          // make position relative to textarea
          left: newLeft,
          top: newTop - _this.textareaRef.scrollTop || 0
        });
      }

      _this.setState({
        actualToken,
        currentTrigger,
        selectionEnd,
        selectionStart
      }, function () {
        try {
          _this._getValuesFromProvider();
        } catch (err) {
          errorMessage(err.message);
        }
      });
    });

    _defineProperty(_assertThisInitialized(_this), "_selectHandler", function (e) {
      var _this$props2 = _this.props,
          onCaretPositionChange = _this$props2.onCaretPositionChange,
          onSelect = _this$props2.onSelect;
      if (onCaretPositionChange) onCaretPositionChange(_this.getCaretPosition());

      if (onSelect) {
        e.persist();
        onSelect(e);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_onClickAndBlurHandler", function (e) {
      var _this$props3 = _this.props,
          closeOnClickOutside = _this$props3.closeOnClickOutside,
          onBlur = _this$props3.onBlur; // If this is a click: e.target is the textarea, and e.relatedTarget is the thing
      // that was actually clicked. If we clicked inside the auto-select dropdown, then
      // that's not a blur, from the auto-select point of view, so then do nothing.

      var el = e.relatedTarget;

      if (_this.dropdownRef && el instanceof Node && _this.dropdownRef.contains(el)) {
        return;
      }

      if (closeOnClickOutside) _this._closeAutocomplete();

      if (onBlur) {
        e.persist();
        onBlur(e);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_onScrollHandler", function () {
      return _this._closeAutocomplete();
    });

    _defineProperty(_assertThisInitialized(_this), "_dropdownScroll", function (item) {
      var scrollToItem = _this.props.scrollToItem;
      if (!scrollToItem) return;

      if (scrollToItem === true) {
        defaultScrollToItem(_this.dropdownRef, item);
        return;
      }

      if (typeof scrollToItem !== 'function' || scrollToItem.length !== 2) {
        throw new Error('`scrollToItem` has to be boolean (true for default implementation) or function with two parameters: container, item.');
      }

      scrollToItem(_this.dropdownRef, item);
    });

    var _this$props4 = _this.props,
        loadingComponent = _this$props4.loadingComponent,
        _trigger = _this$props4.trigger,
        _value = _this$props4.value; // TODO: it would be better to have the parent control state...
    // if (value) this.state.value = value;

    _this._createRegExp();

    if (!loadingComponent) {
      throw new Error('RTA: loadingComponent is not defined');
    }

    if (!_trigger) {
      throw new Error('RTA: trigger is not defined');
    }

    _this.state = {
      actualToken: '',
      component: null,
      currentTrigger: null,
      data: null,
      dataLoading: false,
      left: null,
      listenerIndex: 0,
      selectionEnd: 0,
      selectionStart: 0,
      value: _value || '',
      top: null
    };
    return _this;
  }

  _createClass(ReactTextareaAutocomplete, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      Listeners.add(KEY_CODES.ESC, function () {
        return _this2._closeAutocomplete();
      });
      Listeners.add(KEY_CODES.SPACE, function () {
        return _this2._onSpace();
      });
      var listenerIndex = Listeners.add(KEY_CODES.ENTER, function (e) {
        return _this2._onEnter(e);
      });
      this.setState({
        listenerIndex
      });
      Listeners.startListen();
    }
  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      this._update(nextProps);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      Listeners.stopListen();
      Listeners.remove(this.state.listenerIndex);
    }
  }, {
    key: "_update",
    // TODO: This is an anti pattern in react, should come up with a better way
    value: function _update(_ref) {
      var value = _ref.value,
          trigger = _ref.trigger;
      var oldValue = this.state.value;
      var oldTrigger = this.props.trigger;
      if (value !== oldValue || !oldValue) this.setState({
        value
      });
      /**
       * check if trigger chars are changed, if so, change the regexp accordingly
       */

      if (Object.keys(trigger).join('') !== Object.keys(oldTrigger).join('')) {
        this._createRegExp();
      }
    }
    /**
     * Close autocomplete, also clean up trigger (to avoid slow promises)
     */

  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props5 = this.props,
          className = _this$props5.className,
          containerClassName = _this$props5.containerClassName,
          containerStyle = _this$props5.containerStyle,
          disableMentions = _this$props5.disableMentions,
          dropdownClassName = _this$props5.dropdownClassName,
          dropdownStyle = _this$props5.dropdownStyle,
          itemClassName = _this$props5.itemClassName,
          itemStyle = _this$props5.itemStyle,
          listClassName = _this$props5.listClassName,
          style = _this$props5.style,
          _this$props5$Suggesti = _this$props5.SuggestionList,
          SuggestionList = _this$props5$Suggesti === void 0 ? List : _this$props5$Suggesti;
      var maxRows = this.props.maxRows;
      var _this$state6 = this.state,
          component = _this$state6.component,
          currentTrigger = _this$state6.currentTrigger,
          dataLoading = _this$state6.dataLoading,
          value = _this$state6.value;

      var selectedItem = this._getItemOnSelect();

      var suggestionData = this._getSuggestions();

      var textToReplace = this._getTextToReplace();

      var SuggestionListContainer = function SuggestionListContainer() {
        if ((dataLoading || suggestionData) && currentTrigger && !(disableMentions && currentTrigger === '@')) {
          return /*#__PURE__*/React.createElement("div", {
            className: "rta__autocomplete ".concat(dropdownClassName || ''),
            ref: function ref(_ref2) {
              _this3.dropdownRef = _ref2;
            },
            style: dropdownStyle
          }, component && suggestionData && textToReplace && /*#__PURE__*/React.createElement(SuggestionList, {
            className: listClassName,
            component: component,
            dropdownScroll: _this3._dropdownScroll,
            getSelectedItem: selectedItem,
            getTextToReplace: textToReplace,
            itemClassName: itemClassName,
            itemStyle: itemStyle,
            onSelect: _this3._onSelect,
            value: value,
            values: suggestionData
          }));
        }

        return null;
      };

      if (!this.props.grow) maxRows = 1;
      return /*#__PURE__*/React.createElement("div", {
        className: "rta ".concat(dataLoading === true ? 'rta--loading' : '', " ").concat(containerClassName || ''),
        style: containerStyle
      }, /*#__PURE__*/React.createElement(SuggestionListContainer, null), /*#__PURE__*/React.createElement(Textarea, _extends({}, this._cleanUpProps(), {
        className: "rta__textarea ".concat(className || ''),
        maxRows: maxRows,
        onBlur: this._onClickAndBlurHandler,
        onChange: this._changeHandler,
        onClick: this._onClickAndBlurHandler,
        onFocus: this.props.onFocus,
        onScroll: this._onScrollHandler,
        onSelect: this._selectHandler,
        ref: function ref(_ref3) {
          if (_this3.props.innerRef) _this3.props.innerRef(_ref3);
          _this3.textareaRef = _ref3;
        },
        style: style,
        value: value
      }, this.props.additionalTextareaProps)));
    }
  }]);

  return ReactTextareaAutocomplete;
}(React.Component);

_defineProperty(ReactTextareaAutocomplete, "defaultProps", {
  closeOnClickOutside: true,
  maxRows: 10,
  minChar: 1,
  movePopupAsYouType: false,
  scrollToItem: true,
  value: ''
});

ReactTextareaAutocomplete.propTypes = {
  className: PropTypes.string,
  closeOnClickOutside: PropTypes.bool,
  containerClassName: PropTypes.string,
  containerStyle: PropTypes.object,
  disableMentions: PropTypes.bool,
  dropdownClassName: PropTypes.string,
  dropdownStyle: PropTypes.object,
  itemClassName: PropTypes.string,
  itemStyle: PropTypes.object,
  listClassName: PropTypes.string,
  listStyle: PropTypes.object,
  loaderClassName: PropTypes.string,
  loaderStyle: PropTypes.object,
  loadingComponent: PropTypes.elementType,
  minChar: PropTypes.number,
  onBlur: PropTypes.func,
  onCaretPositionChange: PropTypes.func,
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  style: PropTypes.object,
  SuggestionList: PropTypes.elementType,
  trigger: triggerPropsCheck,
  value: PropTypes.string
};

/**
 * Avatar - A round avatar image with fallback to username's first letter
 *
 * @example ../../docs/Avatar.md
 * @typedef {import('../types').AvatarProps} Props
 * @type { React.FC<Props>}
 */

var Avatar = function Avatar(_ref) {
  var _ref$size = _ref.size,
      size = _ref$size === void 0 ? 32 : _ref$size,
      name = _ref.name,
      _ref$shape = _ref.shape,
      shape = _ref$shape === void 0 ? 'circle' : _ref$shape,
      image = _ref.image,
      _ref$onClick = _ref.onClick,
      onClick = _ref$onClick === void 0 ? function () {} : _ref$onClick,
      _ref$onMouseOver = _ref.onMouseOver,
      onMouseOver = _ref$onMouseOver === void 0 ? function () {} : _ref$onMouseOver;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      loaded = _useState2[0],
      setLoaded = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      error = _useState4[0],
      setError = _useState4[1];

  useEffect(function () {
    setLoaded(false);
    setError(false);
  }, [image]);
  var initials = (name || '').charAt(0);
  var clickableClass = onClick ? 'str-chat__avatar--clickable' : '';
  return /*#__PURE__*/React.createElement("div", {
    "data-testid": "avatar",
    className: "str-chat__avatar str-chat__avatar--".concat(shape, " ").concat(clickableClass),
    title: name,
    style: {
      width: "".concat(size, "px"),
      height: "".concat(size, "px"),
      flexBasis: "".concat(size, "px"),
      lineHeight: "".concat(size, "px"),
      fontSize: "".concat(size / 2, "px")
    },
    onClick: onClick,
    onMouseOver: onMouseOver
  }, image && !error ? /*#__PURE__*/React.createElement("img", {
    "data-testid": "avatar-img",
    src: image,
    alt: initials,
    className: "str-chat__avatar-image".concat(loaded ? ' str-chat__avatar-image--loaded' : ''),
    style: {
      width: "".concat(size, "px"),
      height: "".concat(size, "px"),
      flexBasis: "".concat(size, "px"),
      objectFit: 'cover'
    },
    onLoad: function onLoad() {
      return setLoaded(true);
    },
    onError: function onError() {
      return setError(true);
    }
  }) : /*#__PURE__*/React.createElement("div", {
    "data-testid": "avatar-fallback",
    className: "str-chat__avatar-fallback"
  }, initials));
};

Avatar.propTypes = {
  /** image url */
  image: PropTypes.string,

  /** name of the picture, used for title tag fallback */
  name: PropTypes.string,

  /** shape of the avatar, circle, rounded or square */
  shape: PropTypes.oneOf(['circle', 'rounded', 'square']),

  /** size in pixels */
  size: PropTypes.number,

  /** click event handler */
  onClick: PropTypes.func,

  /** mouseOver event handler */
  onMouseOver: PropTypes.func
};

/** @type {React.FC<import('../types').ChannelPreviewUIComponentProps>} */

var ChannelPreviewCountOnly = function ChannelPreviewCountOnly(_ref) {
  var channel = _ref.channel,
      setActiveChannel = _ref.setActiveChannel,
      watchers = _ref.watchers,
      unread = _ref.unread,
      displayTitle = _ref.displayTitle;
  return /*#__PURE__*/React.createElement("div", {
    className: unread >= 1 ? 'unread' : ''
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setActiveChannel(channel, watchers);
    }
  }, ' ', displayTitle, " ", /*#__PURE__*/React.createElement("span", null, unread)));
};

ChannelPreviewCountOnly.propTypes = {
  /** **Available from [chat context](https://getstream.github.io/stream-chat-react/#chat)** */
  channel: PropTypes.object.isRequired,

  /** @see See [chat context](https://getstream.github.io/stream-chat-react/#chat) for doc */
  setActiveChannel: PropTypes.func.isRequired,

  /**
   * Object containing watcher parameters
   * @see See [Pagination documentation](https://getstream.io/chat/docs/#channel_pagination) for a list of available fields for sort.
   * */
  watchers:
  /** @type {PropTypes.Validator<{ limit?: number | undefined; offset?: number | undefined} | null | undefined> | undefined} */
  PropTypes.object,

  /** Number of unread messages */
  unread: PropTypes.number,

  /** Title of channel to display */
  displayTitle: PropTypes.string
};
var ChannelPreviewCountOnly$1 = /*#__PURE__*/React.memo(ChannelPreviewCountOnly);

var getLatestMessagePreview = function getLatestMessagePreview(channel, t) {
  var latestMessage = channel.state.messages[channel.state.messages.length - 1];

  if (!latestMessage) {
    return t('Nothing yet...');
  }

  if (latestMessage.deleted_at) {
    return t('Message deleted');
  }

  if (latestMessage.text) {
    return latestMessage.text;
  }

  if (latestMessage.command) {
    return "/".concat(latestMessage.command);
  }

  if (latestMessage.attachments.length) {
    return t('🏙 Attachment...');
  }

  return t('Empty message...');
};
var getDisplayTitle = function getDisplayTitle(channel, currentUser) {
  var title = channel.data.name;
  var members = Object.values(channel.state.members);

  if (!title && members.length === 2) {
    var otherMember = members.find(function (m) {
      return m.user.id !== currentUser.id;
    });
    title = otherMember.user.name;
  }

  return title;
};
var getDisplayImage = function getDisplayImage(channel, currentUser) {
  var image = channel.data.image;
  var members = Object.values(channel.state.members);

  if (!image && members.length === 2) {
    var otherMember = members.find(function (m) {
      return m.user.id !== currentUser.id;
    });
    image = otherMember.user.image;
  }

  return image;
};

/**
 * @type {React.FC<import('../types').ChannelPreviewProps>}
 */

var ChannelPreview = function ChannelPreview(props) {
  var channel = props.channel,
      _props$Preview = props.Preview,
      Preview = _props$Preview === void 0 ? ChannelPreviewCountOnly$1 : _props$Preview;

  var _useContext = useContext(ChatContext),
      client = _useContext.client,
      activeChannel = _useContext.channel,
      setActiveChannel = _useContext.setActiveChannel;

  var _useContext2 = useContext(TranslationContext),
      t = _useContext2.t;

  var _useState = useState(
  /** @type {import('stream-chat').MessageResponse | undefined} */
  undefined),
      _useState2 = _slicedToArray(_useState, 2),
      lastMessage = _useState2[0],
      setLastMessage = _useState2[1];

  var _useState3 = useState(0),
      _useState4 = _slicedToArray(_useState3, 2),
      unread = _useState4[0],
      setUnread = _useState4[1];

  var isActive = (activeChannel === null || activeChannel === void 0 ? void 0 : activeChannel.cid) === channel.cid;

  var _channel$muteStatus = channel.muteStatus(),
      muted = _channel$muteStatus.muted;

  useEffect(function () {
    if (isActive || muted) {
      setUnread(0);
    } else {
      setUnread(channel.countUnread());
    }
  }, [channel, isActive, muted]);
  useEffect(function () {
    /** @type {(event: import('stream-chat').Event) => void} */
    var handleEvent = function handleEvent(event) {
      setLastMessage(event.message);

      if (!isActive && !muted) {
        setUnread(channel.countUnread());
      } else {
        setUnread(0);
      }
    };

    channel.on('message.new', handleEvent);
    channel.on('message.updated', handleEvent);
    channel.on('message.deleted', handleEvent);
    return function () {
      channel.off('message.new', handleEvent);
      channel.off('message.updated', handleEvent);
      channel.off('message.deleted', handleEvent);
    };
  }, [channel, isActive, muted]);
  if (!Preview) return null;
  return /*#__PURE__*/React.createElement(Preview, _extends({}, props, {
    setActiveChannel: setActiveChannel,
    lastMessage: lastMessage,
    unread: unread,
    latestMessage: getLatestMessagePreview(channel, t),
    displayTitle: getDisplayTitle(channel, client.user),
    displayImage: getDisplayImage(channel, client.user),
    active: isActive
  }));
};

ChannelPreview.propTypes = {
  /** **Available from [chat context](https://getstream.github.io/stream-chat-react/#chat)** */
  channel:
  /** @type {PropTypes.Validator<import('stream-chat').Channel>} */
  PropTypes.object.isRequired,

  /** Current selected channel object */
  activeChannel:
  /** @type {PropTypes.Validator<import('stream-chat').Channel | null | undefined>} */
  PropTypes.object,

  /**
   * Custom UI component to display user avatar
   *
   * Defaults to and accepts same props as: [Avatar](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Avatar/Avatar.js)
   * */
  Avatar:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').AvatarProps>>} */
  PropTypes.elementType,

  /**
   * Available built-in options (also accepts the same props as):
   *
   * 1. [ChannelPreviewCompact](https://getstream.github.io/stream-chat-react/#ChannelPreviewCompact) (default)
   * 2. [ChannelPreviewLastMessage](https://getstream.github.io/stream-chat-react/#ChannelPreviewLastMessage)
   * 3. [ChannelPreviewMessanger](https://getstream.github.io/stream-chat-react/#ChannelPreviewMessanger)
   *
   * The Preview to use, defaults to ChannelPreviewLastMessage
   * */
  Preview:
  /** @type {PropTypes.Validator<React.ComponentType<import('../types').ChannelPreviewUIComponentProps>>} */
  PropTypes.elementType
};

// @ts-check
/**
 *
 * @example ../../docs/ChannelPreviewCompact.md
 * @type {import('../types').ChannelPreviewCompact}
 */

var ChannelPreviewCompact = function ChannelPreviewCompact(props) {
  var _props$Avatar = props.Avatar,
      Avatar$1 = _props$Avatar === void 0 ? Avatar : _props$Avatar;
  /**
   * @type {React.MutableRefObject<HTMLButtonElement | null>} Typescript syntax
   */

  var channelPreviewButton = useRef(null);
  var unreadClass = props.unread_count >= 1 ? 'str-chat__channel-preview-compact--unread' : '';
  var activeClass = props.active ? 'str-chat__channel-preview-compact--active' : '';

  var onSelectChannel = function onSelectChannel() {
    props.setActiveChannel(props.channel, props.watchers);

    if (channelPreviewButton !== null && channelPreviewButton !== void 0 && channelPreviewButton.current) {
      channelPreviewButton.current.blur();
    }
  };

  return /*#__PURE__*/React.createElement("button", {
    "data-testid": "channel-preview-button",
    onClick: onSelectChannel,
    ref: channelPreviewButton,
    className: "str-chat__channel-preview-compact ".concat(unreadClass, " ").concat(activeClass)
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__channel-preview-compact--left"
  }, /*#__PURE__*/React.createElement(Avatar$1, {
    image: props.displayImage,
    name: props.displayTitle,
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__channel-preview-compact--right"
  }, props.displayTitle));
};

ChannelPreviewCompact.propTypes = {
  /** **Available from [chat context](https://getstream.github.io/stream-chat-react/#chat)** */
  channel: PropTypes.instanceOf(Channel$2).isRequired,

  /** Current selected channel object */
  activeChannel: PropTypes.instanceOf(Channel$2),

  /**
   * Custom UI component to display user avatar
   *
   * Defaults to and accepts same props as: [Avatar](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Avatar/Avatar.js)
   * */
  Avatar:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').AvatarProps>>} */
  PropTypes.elementType,

  /** Setter for selected channel */
  setActiveChannel: PropTypes.func.isRequired,

  /**
   * Object containing watcher parameters
   * @see See [Pagination documentation](https://getstream.io/chat/docs/#channel_pagination) for a list of available fields for sort.
   * */
  watchers:
  /** @type {PropTypes.Validator<{ limit?: number | undefined; offset?: number | undefined} | null | undefined> | undefined} */
  PropTypes.object,

  /** Number of unread messages */
  unread: PropTypes.number,

  /** If channel of component is active (selected) channel */
  active: PropTypes.bool,

  /** Latest message's text. */
  latestMessage: PropTypes.string,

  /** Title of channel to display */
  displayTitle: PropTypes.string,

  /** Image of channel to display */
  displayImage: PropTypes.string
};
var ChannelPreviewCompact$1 = /*#__PURE__*/React.memo(ChannelPreviewCompact);

// @ts-check
/**
 * Used as preview component for channel item in [ChannelList](#channellist) component.
 *
 * @example ../../docs/ChannelPreviewLastMessage.md
 * @type {import('../types').ChannelPreviewLastMessage}
 */

var ChannelPreviewLastMessage = function ChannelPreviewLastMessage(props) {
  var _props$Avatar = props.Avatar,
      Avatar$1 = _props$Avatar === void 0 ? Avatar : _props$Avatar;
  /** @type {React.MutableRefObject<HTMLButtonElement | null>} Typescript syntax */

  var channelPreviewButton = useRef(null);

  var onSelectChannel = function onSelectChannel() {
    props.setActiveChannel(props.channel, props.watchers);

    if (channelPreviewButton !== null && channelPreviewButton !== void 0 && channelPreviewButton.current) {
      channelPreviewButton.current.blur();
    }
  };

  var unreadClass = props.unread >= 1 ? 'str-chat__channel-preview--unread' : '';
  var activeClass = props.active ? 'str-chat__channel-preview--active' : '';
  return /*#__PURE__*/React.createElement("div", {
    className: "str-chat__channel-preview ".concat(unreadClass, " ").concat(activeClass)
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onSelectChannel,
    ref: channelPreviewButton,
    "data-testid": "channel-preview-button"
  }, props.unread >= 1 && /*#__PURE__*/React.createElement("div", {
    className: "str-chat__channel-preview--dot"
  }), /*#__PURE__*/React.createElement(Avatar$1, {
    image: props.displayImage,
    name: props.displayTitle
  }), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__channel-preview-info"
  }, /*#__PURE__*/React.createElement("span", {
    className: "str-chat__channel-preview-title"
  }, props.displayTitle), /*#__PURE__*/React.createElement("span", {
    className: "str-chat__channel-preview-last-message"
  }, truncate(props.latestMessage, props.latestMessageLength)), props.unread >= 1 && /*#__PURE__*/React.createElement("span", {
    className: "str-chat__channel-preview-unread-count"
  }, props.unread))));
};

ChannelPreviewLastMessage.propTypes = {
  /** **Available from [chat context](https://getstream.github.io/stream-chat-react/#chat)** */
  channel: PropTypes.object.isRequired,

  /** Current selected channel object */
  activeChannel: PropTypes.object,

  /**
   * Custom UI component to display user avatar
   *
   * Defaults to and accepts same props as: [Avatar](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Avatar/Avatar.js)
   * */
  Avatar:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').AvatarProps>>} */
  PropTypes.elementType,

  /** Setter for selected channel */
  setActiveChannel: PropTypes.func.isRequired,

  /**
   * Object containing watcher parameters
   * @see See [Pagination documentation](https://getstream.io/chat/docs/#channel_pagination) for a list of available fields for sort.
   * */
  watchers: PropTypes.object,

  /** Number of unread messages */
  unread: PropTypes.number,

  /** If channel of component is active (selected) channel */
  active: PropTypes.bool,

  /** Latest message's text. */
  latestMessage: PropTypes.string,

  /** Length of latest message to truncate at */
  latestMessageLength: PropTypes.number,

  /** Title of channel to display */
  displayTitle: PropTypes.string,

  /** Image of channel to display */
  displayImage: PropTypes.string
};
ChannelPreviewLastMessage.defaultProps = {
  latestMessageLength: 20
};
var ChannelPreviewLastMessage$1 = /*#__PURE__*/React.memo(ChannelPreviewLastMessage);

// @ts-check
/**
 * Used as preview component for channel item in [ChannelList](#channellist) component.
 * Its best suited for messenger type chat.
 *
 * @example ../../docs/ChannelPreviewMessenger.md
 * @type {import('../types').ChannelPreviewMessenger}
 */

var ChannelPreviewMessenger = function ChannelPreviewMessenger(props) {
  var _props$Avatar = props.Avatar,
      Avatar$1 = _props$Avatar === void 0 ? Avatar : _props$Avatar;
  /** @type {React.MutableRefObject<HTMLButtonElement | null>} Typescript syntax */

  var channelPreviewButton = useRef(null);
  var unreadClass = props.unread >= 1 ? 'str-chat__channel-preview-messenger--unread' : '';
  var activeClass = props.active ? 'str-chat__channel-preview-messenger--active' : '';

  var onSelectChannel = function onSelectChannel() {
    props.setActiveChannel(props.channel, props.watchers);

    if (channelPreviewButton !== null && channelPreviewButton !== void 0 && channelPreviewButton.current) {
      channelPreviewButton.current.blur();
    }
  };

  return /*#__PURE__*/React.createElement("button", {
    onClick: onSelectChannel,
    ref: channelPreviewButton,
    className: "str-chat__channel-preview-messenger ".concat(unreadClass, " ").concat(activeClass),
    "data-testid": "channel-preview-button"
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__channel-preview-messenger--left"
  }, /*#__PURE__*/React.createElement(Avatar$1, {
    image: props.displayImage,
    name: props.displayTitle,
    size: 40
  })), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__channel-preview-messenger--right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__channel-preview-messenger--name"
  }, /*#__PURE__*/React.createElement("span", null, props.displayTitle)), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__channel-preview-messenger--last-message"
  }, truncate(props.latestMessage, props.latestMessageLength))));
};

ChannelPreviewMessenger.propTypes = {
  /** **Available from [chat context](https://getstream.github.io/stream-chat-react/#chat)** */
  channel: PropTypes.object.isRequired,

  /** Current selected channel object */
  activeChannel: PropTypes.object,

  /**
   * Custom UI component to display user avatar
   *
   * Defaults to and accepts same props as: [Avatar](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Avatar/Avatar.js)
   * */
  Avatar:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').AvatarProps>>} */
  PropTypes.elementType,

  /** Setter for selected channel */
  setActiveChannel: PropTypes.func.isRequired,

  /**
   * Object containing watcher parameters
   * @see See [Pagination documentation](https://getstream.io/chat/docs/#channel_pagination) for a list of available fields for sort.
   * */
  watchers: PropTypes.object,

  /** Number of unread messages */
  unread: PropTypes.number,

  /** If channel of component is active (selected) channel */
  active: PropTypes.bool,

  /** Latest message's text. */
  latestMessage: PropTypes.string,

  /** Length of latest message to truncate at */
  latestMessageLength: PropTypes.number,

  /** Title of channel to display */
  displayTitle: PropTypes.string,

  /** Image of channel to display */
  displayImage: PropTypes.string
};
ChannelPreviewMessenger.defaultProps = {
  latestMessageLength: 14
};
var ChannelPreviewMessenger$1 = /*#__PURE__*/React.memo(ChannelPreviewMessenger);

function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$3(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var emojiSetDef = {
  spriteUrl: 'https://getstream.imgix.net/images/emoji-sprite.png',
  size: 20,
  sheetColumns: 2,
  sheetRows: 3,
  sheetSize: 64
};
/** @type {import("types").commonEmojiInterface} */

var commonEmoji = {
  emoticons: [],
  short_names: [],
  custom: true
};
/** @type {import("types").MinimalEmojiInterface[]} */

var defaultMinimalEmojis = [_objectSpread$3(_objectSpread$3({
  id: 'like',
  name: 'like',
  colons: ':+1:',
  sheet_x: 0,
  sheet_y: 0
}, commonEmoji), emojiSetDef), _objectSpread$3(_objectSpread$3({
  id: 'love',
  name: 'love',
  colons: ':heart:',
  sheet_x: 1,
  sheet_y: 2
}, commonEmoji), emojiSetDef), _objectSpread$3(_objectSpread$3({
  id: 'haha',
  name: 'haha',
  colons: ':joy:',
  sheet_x: 1,
  sheet_y: 0
}, commonEmoji), emojiSetDef), _objectSpread$3(_objectSpread$3({
  id: 'wow',
  name: 'wow',
  colons: ':astonished:',
  sheet_x: 0,
  sheet_y: 2
}, commonEmoji), emojiSetDef), _objectSpread$3(_objectSpread$3({
  id: 'sad',
  name: 'sad',
  colons: ':pensive:',
  sheet_x: 0,
  sheet_y: 1
}, commonEmoji), emojiSetDef), _objectSpread$3(_objectSpread$3({
  id: 'angry',
  name: 'angry',
  colons: ':angry:',
  sheet_x: 1,
  sheet_y: 1
}, commonEmoji), emojiSetDef)]; // use this only for small lists like in ReactionSelector

/** @typedef {import('emoji-mart').Data} EmojiData
 * @type {(data: EmojiData) => EmojiData}
 */

var getStrippedEmojiData = function getStrippedEmojiData(data) {
  return _objectSpread$3(_objectSpread$3({}, data), {}, {
    emojis: {}
  });
};

// @ts-check
var ReplyIcon = function ReplyIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "15",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M.56 10.946H.06l-.002-.498L.025.92a.5.5 0 1 1 1-.004l.032 9.029H9.06v-4l9 4.5-9 4.5v-4H.56z",
    fillRule: "nonzero"
  }));
};
var DeliveredCheckIcon = function DeliveredCheckIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm3.72 6.633a.955.955 0 1 0-1.352-1.352L6.986 8.663 5.633 7.31A.956.956 0 1 0 4.28 8.663l2.029 2.028a.956.956 0 0 0 1.353 0l4.058-4.058z",
    fill: "#006CFF",
    fillRule: "evenodd"
  }));
};
var ReactionIcon = function ReactionIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "12",
    height: "12",
    viewBox: "0 0 12 12"
  }, /*#__PURE__*/React.createElement("g", {
    fillRule: "evenodd",
    clipRule: "evenodd"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 1.2C3.3 1.2 1.2 3.3 1.2 6c0 2.7 2.1 4.8 4.8 4.8 2.7 0 4.8-2.1 4.8-4.8 0-2.7-2.1-4.8-4.8-4.8zM0 6c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6-6-2.7-6-6z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5.4 4.5c0 .5-.4.9-.9.9s-.9-.4-.9-.9.4-.9.9-.9.9.4.9.9zM8.4 4.5c0 .5-.4.9-.9.9s-.9-.4-.9-.9.4-.9.9-.9.9.4.9.9zM3.3 6.7c.3-.2.6-.1.8.1.3.4.8.9 1.5 1 .6.2 1.4.1 2.4-1 .2-.2.6-.3.8 0 .2.2.3.6 0 .8-1.1 1.3-2.4 1.7-3.5 1.5-1-.2-1.8-.9-2.2-1.5-.2-.3-.1-.7.2-.9z"
  })));
};
var ThreadIcon = function ThreadIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "10",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8.516 3c4.78 0 4.972 6.5 4.972 6.5-1.6-2.906-2.847-3.184-4.972-3.184v2.872L3.772 4.994 8.516.5V3zM.484 5l4.5-4.237v1.78L2.416 5l2.568 2.125v1.828L.484 5z",
    fillRule: "evenodd"
  }));
};
var ErrorIcon = function ErrorIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 0a7 7 0 1 0 0 14A7 7 0 0 0 7 0zm.875 10.938a.438.438 0 0 1-.438.437h-.875a.438.438 0 0 1-.437-.438v-.874c0-.242.196-.438.438-.438h.875c.241 0 .437.196.437.438v.874zm0-2.626a.438.438 0 0 1-.438.438h-.875a.438.438 0 0 1-.437-.438v-5.25c0-.241.196-.437.438-.437h.875c.241 0 .437.196.437.438v5.25z",
    fill: "#EA152F",
    fillRule: "evenodd"
  }));
};
var PinIcon = function PinIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "13",
    viewBox: "0 0 14 13",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M13.3518 6.686L6.75251 0.0866699L5.80984 1.02867L6.75318 1.972V1.97334L3.45318 5.272L3.45251 5.27334L2.50984 4.32934L1.56718 5.27267L4.39584 8.10067L0.624512 11.8713L1.56718 12.814L5.33851 9.04334L8.16718 11.8713L9.10984 10.9293L8.16718 9.986L11.4672 6.686L12.4098 7.62867L13.3518 6.686ZM7.22451 9.04267L7.22385 9.04334L4.39584 6.21467L7.69518 2.91467L10.5232 5.74267L7.22451 9.04267Z",
    fillRule: "evenodd"
  }));
};
/** @type {React.FC<import("types").PinIndicatorProps>} */

var PinIndicator = function PinIndicator(_ref) {
  var _message$pinned_by, _message$pinned_by2;

  var message = _ref.message,
      t = _ref.t;
  if (!message || !t) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(PinIcon, null), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '0',
      marginTop: '0',
      marginLeft: '8px',
      fontSize: '14px'
    }
  }, message.pinned_by ? "".concat(t('Pinned by'), " ").concat(((_message$pinned_by = message.pinned_by) === null || _message$pinned_by === void 0 ? void 0 : _message$pinned_by.name) || ((_message$pinned_by2 = message.pinned_by) === null || _message$pinned_by2 === void 0 ? void 0 : _message$pinned_by2.id)) : t('Message pinned')));
};

// @ts-check
/** @type {React.FC<import("types").MessageRepliesCountButtonProps>} */

var MessageRepliesCountButton = function MessageRepliesCountButton(_ref) {
  var reply_count = _ref.reply_count,
      labelSingle = _ref.labelSingle,
      labelPlural = _ref.labelPlural,
      onClick = _ref.onClick;

  var _useContext = useContext(TranslationContext),
      t = _useContext.t;

  var singleReplyText;
  var pluralReplyText;

  if (reply_count === 1) {
    if (labelSingle) {
      singleReplyText = "1 ".concat(labelSingle);
    } else {
      singleReplyText = t('1 reply');
    }
  }

  if (reply_count && reply_count > 1) {
    if (labelPlural) {
      pluralReplyText = "".concat(reply_count, " ").concat(labelPlural);
    } else {
      pluralReplyText = t('{{ replyCount }} replies', {
        replyCount: reply_count
      });
    }
  }

  if (reply_count && reply_count !== 0) {
    return /*#__PURE__*/React.createElement("button", {
      "data-testid": "replies-count-button",
      className: "str-chat__message-replies-count-button",
      onClick: onClick
    }, /*#__PURE__*/React.createElement(ReplyIcon, null), reply_count === 1 ? singleReplyText : pluralReplyText);
  }

  return null;
};

MessageRepliesCountButton.defaultProps = {
  reply_count: 0
};
MessageRepliesCountButton.propTypes = {
  /** Label for number of replies, when count is 1 */
  labelSingle: PropTypes.string,

  /** Label for number of replies, when count is more than 1 */
  labelPlural: PropTypes.string,

  /** Number of replies */
  reply_count: PropTypes.number,

  /**
   * click handler for button
   * @param event React's MouseEventHandler event
   * @returns void
   * */
  onClick: PropTypes.func
};
var MessageRepliesCountButton$1 = /*#__PURE__*/React.memo(MessageRepliesCountButton);

// @ts-check
/**
 * MML - A wrapper component around MML-React library
 *
 * @example ../../docs/MML.md
 * @typedef {import('../types').MMLProps} Props
 * @type { React.FC<Props>}
 */

var MML = function MML(_ref) {
  var source = _ref.source,
      actionHandler = _ref.actionHandler,
      _ref$align = _ref.align,
      align = _ref$align === void 0 ? 'right' : _ref$align;

  var _useContext = useContext(ChatContext),
      theme = _useContext.theme;

  if (!source) return null;
  return /*#__PURE__*/React.createElement(MML$1, {
    source: source,
    className: "mml-align-".concat(align),
    onSubmit: actionHandler,
    Loading: null,
    Success: null,
    theme: (theme || '').replace(' ', '-')
  });
};

MML.propTypes = {
  /** mml source string */
  source: PropTypes.string.isRequired,

  /** submit handler for mml actions */
  actionHandler: PropTypes.func,

  /** align mml components to left/right */
  align: PropTypes.oneOf(['left', 'right'])
};

// @ts-check
/** @type {React.FC<import("types").ModalProps>} */

var Modal = function Modal(_ref) {
  var children = _ref.children,
      onClose = _ref.onClose,
      open = _ref.open;

  /** @type {React.RefObject<HTMLDivElement>} */
  var innerRef = useRef(null);

  var _useContext = useContext(TranslationContext),
      t = _useContext.t;
  /** @param {React.MouseEvent} e */


  var handleClick = function handleClick(e) {
    var _innerRef$current;

    if (e.target instanceof Node && !((_innerRef$current = innerRef.current) !== null && _innerRef$current !== void 0 && _innerRef$current.contains(e.target)) && onClose) {
      onClose();
    }
  };

  useEffect(function () {
    if (!open) return function () {};
    /** @type {EventListener} */

    var handleEscKey = function handleEscKey(e) {
      if (e instanceof KeyboardEvent && e.keyCode === 27 && onClose) {
        onClose();
      }
    };

    document.addEventListener('keyPress', handleEscKey, false);
    return function () {
      return document.removeEventListener('keyPress', handleEscKey, false);
    };
  }, [onClose, open]);
  var openClasses = open ? 'str-chat__modal--open' : 'str-chat__modal--closed';
  return /*#__PURE__*/React.createElement("div", {
    className: "str-chat__modal ".concat(openClasses),
    onClick: handleClick
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__modal__close-button"
  }, t('Close'), /*#__PURE__*/React.createElement("svg", {
    width: "10",
    height: "10",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9.916 1.027L8.973.084 5 4.058 1.027.084l-.943.943L4.058 5 .084 8.973l.943.943L5 5.942l3.973 3.974.943-.943L5.942 5z",
    fillRule: "evenodd"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__modal__inner",
    ref: innerRef
  }, children));
};

Modal.propTypes = {
  /** Callback handler for closing of modal. */
  onClose: PropTypes.func.isRequired,

  /** If true, modal is opened or visible. */
  open: PropTypes.bool.isRequired
};

// @ts-check
/**
 * @type {React.FC<import('../types').CommandItemProps>}
 */

var CommandItem = function CommandItem(_ref) {
  var entity = _ref.entity;
  return /*#__PURE__*/React.createElement("div", {
    className: "str-chat__slash-command"
  }, /*#__PURE__*/React.createElement("span", {
    className: "str-chat__slash-command-header"
  }, /*#__PURE__*/React.createElement("strong", null, entity.name), " ", entity.args), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    className: "str-chat__slash-command-description"
  }, entity.description));
};

CommandItem.propTypes = {
  entity: PropTypes.shape({
    /** Name of the command */
    name: PropTypes.string,

    /** Arguments of command */
    args: PropTypes.string,

    /** Description of command */
    description: PropTypes.string
  }).isRequired
};
var CommandItem$1 = /*#__PURE__*/React.memo(CommandItem);

// @ts-check
/** @type {React.FC<import("types").EmoticonItemProps>} */

var EmoticonItem = function EmoticonItem(_ref) {
  var entity = _ref.entity;
  return /*#__PURE__*/React.createElement("div", {
    className: "str-chat__emoji-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "str-chat__emoji-item--entity"
  }, entity.native), /*#__PURE__*/React.createElement("span", {
    className: "str-chat__emoji-item--name"
  }, entity.name));
};

EmoticonItem.propTypes = {
  entity: PropTypes.shape({
    /** Name for emoticon */
    name: PropTypes.string.isRequired,

    /** Native value or actual emoticon */
    native: PropTypes.string.isRequired
  }).isRequired
};
var EmoticonItem$1 = /*#__PURE__*/React.memo(EmoticonItem);

// @ts-check

var LoadingItems = function LoadingItems() {
  return /*#__PURE__*/React.createElement("div", {
    className: "str-chat__loading-channels-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__loading-channels-avatar"
  }), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__loading-channels-meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__loading-channels-username"
  }), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__loading-channels-status"
  })));
};
/**
 * LoadingChannels - Fancy loading indicator for the channel list
 *
 * @example ../../docs/LoadingChannels.md
 */


var LoadingChannels = function LoadingChannels() {
  return /*#__PURE__*/React.createElement("div", {
    className: "str-chat__loading-channels"
  }, /*#__PURE__*/React.createElement(LoadingItems, null), /*#__PURE__*/React.createElement(LoadingItems, null), /*#__PURE__*/React.createElement(LoadingItems, null));
};

var LoadingChannels$1 = /*#__PURE__*/React.memo(LoadingChannels);

// @ts-check
/**
 * LoadingErrorIndicator - UI component for error indicator in Channel.
 *
 * @example ../../docs/LoadingErrorIndicator.md
 * @type {React.FC<import('../types').LoadingErrorIndicatorProps>}
 */

var LoadingErrorIndicator = function LoadingErrorIndicator(_ref) {
  var error = _ref.error;

  var _useContext = useContext(TranslationContext),
      t = _useContext.t;

  if (!error) return null;
  return /*#__PURE__*/React.createElement("div", null, t('Error: {{ errorMessage }}', {
    errorMessage: error.message
  }));
};

LoadingErrorIndicator.defaultProps = {
  error: null
};
LoadingErrorIndicator.propTypes = {
  /** Error object */
  error: PropTypes.instanceOf(Error)
};
var DefaultLoadingErrorIndicator = /*#__PURE__*/React.memo(LoadingErrorIndicator);

// @ts-check
/**
 * LoadingIndicator - Just a simple loading spinner..
 *
 * @example ../../docs/LoadingIndicator.md
 * @type { React.FC<import('../types').LoadingIndicatorProps>}
 */

var LoadingIndicator = function LoadingIndicator(_ref) {
  var _ref$size = _ref.size,
      size = _ref$size === void 0 ? 15 : _ref$size,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? '#006CFF' : _ref$color;
  return /*#__PURE__*/React.createElement("div", {
    className: "str-chat__loading-indicator ".concat(color),
    "data-testid": "loading-indicator-wrapper",
    style: {
      width: size,
      height: size
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 30 30",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    x1: "50%",
    y1: "0%",
    x2: "50%",
    y2: "100%",
    id: "a"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#FFF",
    stopOpacity: "0",
    offset: "0%"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    "data-testid": "loading-indicator-circle",
    stopColor: color,
    stopOpacity: "1",
    style: {
      stopColor: color
    }
  }))), /*#__PURE__*/React.createElement("path", {
    d: "M2.518 23.321l1.664-1.11A12.988 12.988 0 0 0 15 28c7.18 0 13-5.82 13-13S22.18 2 15 2V0c8.284 0 15 6.716 15 15 0 8.284-6.716 15-15 15-5.206 0-9.792-2.652-12.482-6.679z",
    fill: "url(#a)",
    fillRule: "evenodd"
  })));
};

var DefaultLoadingIndicator = /*#__PURE__*/React.memo(LoadingIndicator);

// @ts-check
/**
 * UserItem - Component rendered in commands menu
 * @typedef {import('../types').UserItemProps} Props
 * @type {React.FC<Props>}
 */

var UserItem = function UserItem(_ref) {
  var _ref$Avatar = _ref.Avatar,
      Avatar$1 = _ref$Avatar === void 0 ? Avatar : _ref$Avatar,
      entity = _ref.entity;
  return /*#__PURE__*/React.createElement("div", {
    className: "str-chat__user-item"
  }, /*#__PURE__*/React.createElement(Avatar$1, {
    size: 20,
    image: entity.image
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, entity.name), " ", !entity.name ? entity.id : ''));
};

UserItem.propTypes = {
  entity: PropTypes.shape({
    /** Name of the user */
    name: PropTypes.string,

    /** Id of the user */
    id: PropTypes.string,

    /** Image of the user */
    image: PropTypes.string
  }).isRequired,

  /**
   * Custom UI component to display user avatar
   *
   * Defaults to and accepts same props as: [Avatar](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Avatar/Avatar.js)
   * */
  Avatar:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').AvatarProps>>} */
  PropTypes.elementType
};
var UserItem$1 = /*#__PURE__*/React.memo(UserItem);

/** @type {React.FC<import("types").ChatAutoCompleteProps>} */

var ChatAutoComplete = function ChatAutoComplete(props) {
  var _channel$state, _channel$state2;

  var commands = props.commands,
      onSelectItem = props.onSelectItem,
      triggers = props.triggers;

  var _useContext = useContext(ChannelContext),
      channel = _useContext.channel,
      emojiConfig = _useContext.emojiConfig;

  var members = channel === null || channel === void 0 ? void 0 : (_channel$state = channel.state) === null || _channel$state === void 0 ? void 0 : _channel$state.members;
  var watchers = channel === null || channel === void 0 ? void 0 : (_channel$state2 = channel.state) === null || _channel$state2 === void 0 ? void 0 : _channel$state2.watchers;

  var _ref = emojiConfig || {},
      emojiData = _ref.emojiData,
      EmojiIndex = _ref.EmojiIndex;

  var emojiIndex = useMemo(function () {
    if (EmojiIndex) {
      return new EmojiIndex(emojiData);
    }

    return null;
  }, [emojiData, EmojiIndex]);
  /** @param {string} word */

  var emojiReplace = function emojiReplace(word) {
    var found = (emojiIndex === null || emojiIndex === void 0 ? void 0 : emojiIndex.search(word)) || [];
    var emoji = found.slice(0, 10).find(
    /** @type {{ ({ emoticons } : import('emoji-mart').EmojiData): boolean }} */
    function (_ref2) {
      var emoticons = _ref2.emoticons;
      return !!(emoticons !== null && emoticons !== void 0 && emoticons.includes(word));
    });
    if (!emoji || !('native' in emoji)) return null;
    return emoji.native;
  };

  var getMembersAndWatchers = useCallback(function () {
    var memberUsers = members ? Object.values(members).map(function (_ref3) {
      var user = _ref3.user;
      return user;
    }) : [];
    var watcherUsers = watchers ? Object.values(watchers) : [];
    var users = [].concat(_toConsumableArray(memberUsers), _toConsumableArray(watcherUsers)); // make sure we don't list users twice

    /** @type {{ [key: string]: import('stream-chat').UserResponse<import('../types').StreamChatReactUserType> }} */

    var uniqueUsers = {};
    users.forEach(function (user) {
      if (user && !uniqueUsers[user.id]) {
        uniqueUsers[user.id] = user;
      }
    });
    return Object.values(uniqueUsers);
  }, [members, watchers]); // eslint-disable-next-line react-hooks/exhaustive-deps

  var queryMembersDebounced = useCallback(debounce(
  /*#__PURE__*/

  /**
   * @param {string} query
   * @param {(data: any[]) => void} onReady
   */
  function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(query, onReady) {
      var response, users;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (channel !== null && channel !== void 0 && channel.queryMembers) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return");

            case 2:
              _context.next = 4;
              return channel === null || channel === void 0 ? void 0 : channel.queryMembers({
                name: {
                  $autocomplete: query
                }
              });

            case 4:
              response = _context.sent;
              users = response.members.map(function (m) {
                return m.user;
              });
              if (onReady) onReady(users);

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x, _x2) {
      return _ref4.apply(this, arguments);
    };
  }(), 200), [channel === null || channel === void 0 ? void 0 : channel.queryMembers]);
  /**
   * dataProvider accepts `onReady` function, which will executed once the data is ready.
   * Another approach would have been to simply return the data from dataProvider and let the
   * component await for it and then execute the required logic. We are going for callback instead
   * of async-await since we have debounce function in dataProvider. Which will delay the execution
   * of api call on trailing end of debounce (lets call it a1) but will return with result of
   * previous call without waiting for a1. So in this case, we want to execute onReady, when trailing
   * end of debounce executes.
   * @type {() => import("../AutoCompleteTextarea/types").TriggerMap | object}
   */

  var getTriggers = useCallback(function () {
    return triggers || {
      ':': {
        dataProvider: function dataProvider(q, text, onReady) {
          if (q.length === 0 || q.charAt(0).match(/[^a-zA-Z0-9+-]/)) {
            return [];
          }

          var emojis = (emojiIndex === null || emojiIndex === void 0 ? void 0 : emojiIndex.search(q)) || [];
          var result = emojis.slice(0, 10);
          if (onReady) onReady(result, q);
          return result;
        },
        component: EmoticonItem$1,
        output: function output(entity) {
          return {
            key: entity.id,
            text: "".concat(entity.native),
            caretPosition: 'next'
          };
        }
      },
      '@': {
        dataProvider: function dataProvider(query, text, onReady) {
          // By default, we return maximum 100 members via queryChannels api call.
          // Thus it is safe to assume, that if number of members in channel.state is < 100,
          // then all the members are already available on client side and we don't need to
          // make any api call to queryMembers endpoint.
          if (!query || Object.values(members || {}).length < 100) {
            var users = getMembersAndWatchers();
            var matchingUsers = users.filter(function (user) {
              if (!query) return true;

              if (user.name !== undefined && user.name.toLowerCase().includes(query.toLowerCase())) {
                return true;
              }

              return user.id.toLowerCase().includes(query.toLowerCase());
            });
            var data = matchingUsers.slice(0, 10);
            if (onReady) onReady(data, query);
            return data;
          }

          return queryMembersDebounced(query,
          /** @param {any[]} data */
          function (data) {
            if (onReady) onReady(data, query);
          });
        },
        component: UserItem$1,
        output: function output(entity) {
          return {
            key: entity.id,
            text: "@".concat(entity.name || entity.id),
            caretPosition: 'next'
          };
        },
        callback: function callback(item) {
          return onSelectItem && onSelectItem(item);
        }
      },
      '/': {
        dataProvider: function dataProvider(q, text, onReady) {
          if (text.indexOf('/') !== 0 || !commands) {
            return [];
          }

          var selectedCommands = commands.filter(function (c) {
            var _c$name;

            return ((_c$name = c.name) === null || _c$name === void 0 ? void 0 : _c$name.indexOf(q)) !== -1;
          }); // sort alphabetically unless the you're matching the first char

          selectedCommands.sort(function (a, b) {
            var _a$name, _b$name, _nameA, _nameB;

            var nameA = (_a$name = a.name) === null || _a$name === void 0 ? void 0 : _a$name.toLowerCase();
            var nameB = (_b$name = b.name) === null || _b$name === void 0 ? void 0 : _b$name.toLowerCase();

            if (((_nameA = nameA) === null || _nameA === void 0 ? void 0 : _nameA.indexOf(q)) === 0) {
              nameA = "0".concat(nameA);
            }

            if (((_nameB = nameB) === null || _nameB === void 0 ? void 0 : _nameB.indexOf(q)) === 0) {
              nameB = "0".concat(nameB);
            } // Should confirm possible null / undefined when TS is fully implemented


            if (nameA != null && nameB != null) {
              if (nameA < nameB) {
                return -1;
              }

              if (nameA > nameB) {
                return 1;
              }
            }

            return 0;
          });
          var result = selectedCommands.slice(0, 10);
          if (onReady) onReady(result, q);
          return result;
        },
        component: CommandItem$1,
        output: function output(entity) {
          return {
            key: entity.id,
            text: "/".concat(entity.name),
            caretPosition: 'next'
          };
        }
      }
    };
  }, [commands, getMembersAndWatchers, members, onSelectItem, queryMembersDebounced, triggers, emojiIndex]);
  var innerRef = props.innerRef;
  var updateInnerRef = useCallback(function (ref) {
    if (innerRef) innerRef.current = ref;
  }, [innerRef]);
  return /*#__PURE__*/React.createElement(ReactTextareaAutocomplete, {
    loadingComponent: DefaultLoadingIndicator,
    trigger: getTriggers(),
    replaceWord: emojiReplace,
    minChar: 0,
    maxRows: props.maxRows,
    innerRef: updateInnerRef,
    onFocus: props.onFocus,
    rows: props.rows,
    className: "str-chat__textarea__textarea",
    containerClassName: "str-chat__textarea",
    dropdownClassName: "str-chat__emojisearch",
    listClassName: "str-chat__emojisearch__list",
    itemClassName: "str-chat__emojisearch__item",
    placeholder: props.placeholder,
    onChange: props.onChange,
    handleSubmit: props.handleSubmit,
    onPaste: props.onPaste,
    value: props.value,
    grow: props.grow,
    disabled: props.disabled,
    disableMentions: props.disableMentions,
    SuggestionList: props.SuggestionList,
    additionalTextareaProps: props.additionalTextareaProps
  });
};

ChatAutoComplete.propTypes = {
  /** The number of rows you want the textarea to have */
  rows: PropTypes.number,

  /** Grow the number of rows of the textarea while you're typing */
  grow: PropTypes.bool,

  /** Maximum number of rows */
  maxRows: PropTypes.number,

  /** Make the textarea disabled */
  disabled: PropTypes.bool,

  /** Disable mentions */
  disableMentions: PropTypes.bool,

  /** The value of the textarea */
  value: PropTypes.string,

  /** Function to run on pasting within the textarea */
  onPaste: PropTypes.func,

  /** Function that runs on submit */
  handleSubmit: PropTypes.func,

  /** Function that runs on change */
  onChange: PropTypes.func,

  /** Placeholder for the textarea */
  placeholder: PropTypes.string,

  /** What loading component to use for the auto complete when loading results. */
  LoadingIndicator:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').LoadingIndicatorProps>>} */
  PropTypes.elementType,

  /** Minimum number of Character */
  minChar: PropTypes.number,

  /**
   * Handler for selecting item from suggestions list
   *
   * @param item Selected item object.
   *  */
  onSelectItem: PropTypes.func,

  /** Array of [commands](https://getstream.io/chat/docs/#channel_commands) */
  commands: PropTypes.array,

  /** Listener for onfocus event on textarea */
  onFocus: PropTypes.func,

  /** Optional UI component prop to override the default List component that displays suggestions */
  SuggestionList:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').SuggestionListProps>>} */
  PropTypes.elementType,

  /**
   * Any additional attributes that you may want to add for underlying HTML textarea element.
   */
  additionalTextareaProps: PropTypes.object
};
ChatAutoComplete.defaultProps = {
  rows: 3
};
var ChatAutoComplete$1 = /*#__PURE__*/React.memo(ChatAutoComplete);

/**
 * @type {React.FC<import('../types').TooltipProps>}
 */

var Tooltip = function Tooltip(props) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "str-chat__tooltip"
  }, props), props.children);
};

var Tooltip$1 = /*#__PURE__*/React.memo(Tooltip);

function ownKeys$4(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$4(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$4(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$4(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
/**
 * @typedef {import("types").MessageInputState} State
 * @typedef {import("types").MessageInputProps} Props
 * @typedef {import('stream-chat').Unpacked<ReturnType<import("types").StreamChatReactClient['sendFile']>>} FileUploadAPIResponse
 * @typedef {import('stream-chat').UserResponse} UserResponse
 */

/**
 * Get attachment type from MIME type
 * @param {string} mime
 * @returns {string}
 */

var getAttachmentTypeFromMime = function getAttachmentTypeFromMime(mime) {
  if (mime.includes('video/')) return 'media';
  if (mime.includes('audio/')) return 'audio';
  return 'file';
};
/** @type {{ [id: string]: import('../types').FileUpload }} */


var emptyFileUploads = {};
/** @type {{ [id: string]: import('../types').ImageUpload }} */

var emptyImageUploads = {};
var apiMaxNumberOfFiles = 10;
/**
 * Initializes the state. Empty if the message prop is falsy.
 * @param {import("stream-chat").MessageResponse | undefined} message
 * @returns {State}
 */

function initState(message) {
  var _message$attachments, _message$attachments2, _message$attachments3;

  if (!message) {
    return {
      text: '',
      imageOrder: [],
      imageUploads: _objectSpread$4({}, emptyImageUploads),
      fileOrder: [],
      fileUploads: _objectSpread$4({}, emptyFileUploads),
      numberOfUploads: 0,
      attachments: [],
      mentioned_users: [],
      emojiPickerIsOpen: false
    };
  } // if message prop is defined, get image uploads, file uploads, text, etc. from it


  var imageUploads = ((_message$attachments = message.attachments) === null || _message$attachments === void 0 ? void 0 : _message$attachments.filter(function (_ref) {
    var type = _ref.type;
    return type === 'image';
  }).reduce(function (acc, attachment) {
    var id = generateRandomId();
    acc[id] = {
      id,
      url: attachment.image_url,
      state: 'finished',
      file: {
        name: attachment.fallback
      }
    };
    return acc;
  }, {})) || {};
  var imageOrder = Object.keys(imageUploads);
  var fileUploads = ((_message$attachments2 = message.attachments) === null || _message$attachments2 === void 0 ? void 0 : _message$attachments2.filter(function (_ref2) {
    var type = _ref2.type;
    return type === 'file';
  }).reduce(function (acc, attachment) {
    var id = generateRandomId();
    acc[id] = {
      id,
      url: attachment.asset_url,
      state: 'finished',
      file: {
        name: attachment.title,
        type: attachment.mime_type,
        size: attachment.file_size
      }
    };
    return acc;
  }, {})) || {};
  var fileOrder = Object.keys(fileUploads);
  var numberOfUploads = fileOrder.length + imageOrder.length;
  var attachments = ((_message$attachments3 = message.attachments) === null || _message$attachments3 === void 0 ? void 0 : _message$attachments3.filter(function (_ref3) {
    var type = _ref3.type;
    return type !== 'file' && type !== 'image';
  })) || [];
  var mentioned_users = message.mentioned_users || [];
  return {
    attachments,
    emojiPickerIsOpen: false,
    fileOrder,
    fileUploads,
    imageOrder,
    imageUploads,
    mentioned_users,
    numberOfUploads,
    text: message.text || ''
  };
}
/**
 * MessageInput state reducer
 * @param {State} state
 * @param {import("./types").MessageInputReducerAction} action
 * @returns {State}
 */


function messageInputReducer(state, action) {
  switch (action.type) {
    case 'setEmojiPickerIsOpen':
      return _objectSpread$4(_objectSpread$4({}, state), {}, {
        emojiPickerIsOpen: action.value
      });

    case 'setText':
      return _objectSpread$4(_objectSpread$4({}, state), {}, {
        text: action.getNewText(state.text)
      });

    case 'clear':
      return {
        attachments: [],
        emojiPickerIsOpen: false,
        fileOrder: [],
        fileUploads: _objectSpread$4({}, emptyFileUploads),
        imageOrder: [],
        imageUploads: _objectSpread$4({}, emptyImageUploads),
        mentioned_users: [],
        numberOfUploads: 0,
        text: ''
      };

    case 'setImageUpload':
      {
        var imageAlreadyExists = state.imageUploads[action.id];
        if (!imageAlreadyExists && !action.file) return state;
        var imageOrder = imageAlreadyExists ? state.imageOrder : state.imageOrder.concat(action.id);

        var type = action.type,
            newUploadFields = _objectWithoutProperties(action, ["type"]);

        return _objectSpread$4(_objectSpread$4({}, state), {}, {
          imageOrder,
          imageUploads: _objectSpread$4(_objectSpread$4({}, state.imageUploads), {}, {
            [action.id]: _objectSpread$4(_objectSpread$4({}, state.imageUploads[action.id]), newUploadFields)
          }),
          numberOfUploads: imageAlreadyExists ? state.numberOfUploads : state.numberOfUploads + 1
        });
      }

    case 'setFileUpload':
      {
        var fileAlreadyExists = state.fileUploads[action.id];
        if (!fileAlreadyExists && !action.file) return state;
        var fileOrder = fileAlreadyExists ? state.fileOrder : state.fileOrder.concat(action.id);

        var _type = action.type,
            _newUploadFields = _objectWithoutProperties(action, ["type"]);

        return _objectSpread$4(_objectSpread$4({}, state), {}, {
          fileOrder,
          fileUploads: _objectSpread$4(_objectSpread$4({}, state.fileUploads), {}, {
            [action.id]: _objectSpread$4(_objectSpread$4({}, state.fileUploads[action.id]), _newUploadFields)
          }),
          numberOfUploads: fileAlreadyExists ? state.numberOfUploads : state.numberOfUploads + 1
        });
      }

    case 'removeImageUpload':
      {
        if (!state.imageUploads[action.id]) return state; // cannot remove anything

        var newImageUploads = _objectSpread$4({}, state.imageUploads);

        delete newImageUploads[action.id];
        return _objectSpread$4(_objectSpread$4({}, state), {}, {
          numberOfUploads: state.numberOfUploads - 1,
          imageOrder: state.imageOrder.filter(function (_id) {
            return _id !== action.id;
          }),
          imageUploads: newImageUploads
        });
      }

    case 'removeFileUpload':
      {
        if (!state.fileUploads[action.id]) return state; // cannot remove anything

        var newFileUploads = _objectSpread$4({}, state.fileUploads);

        delete newFileUploads[action.id];
        return _objectSpread$4(_objectSpread$4({}, state), {}, {
          numberOfUploads: state.numberOfUploads - 1,
          fileOrder: state.fileOrder.filter(function (_id) {
            return _id !== action.id;
          }),
          fileUploads: newFileUploads
        });
      }

    case 'reduceNumberOfUploads':
      // TODO: figure out if we can just use uploadOrder instead
      return _objectSpread$4(_objectSpread$4({}, state), {}, {
        numberOfUploads: state.numberOfUploads - 1
      });

    case 'addMentionedUser':
      return _objectSpread$4(_objectSpread$4({}, state), {}, {
        mentioned_users: state.mentioned_users.concat(action.user)
      });

    default:
      return state;
  }
}
/**
 * hook for MessageInput state
 * @type{import('../types').useMessageInput}
 */


function useMessageInput(props) {
  var _channel$getConfig2, _channel$getConfig2$c;

  var additionalTextareaProps = props.additionalTextareaProps,
      clearEditingState = props.clearEditingState,
      doImageUploadRequest = props.doImageUploadRequest,
      doFileUploadRequest = props.doFileUploadRequest,
      errorHandler = props.errorHandler,
      focus = props.focus,
      message = props.message,
      noFiles = props.noFiles,
      overrideSubmitHandler = props.overrideSubmitHandler,
      parent = props.parent,
      publishTypingEvent = props.publishTypingEvent;

  var _useContext = useContext(ChannelContext),
      channel = _useContext.channel,
      editMessage = _useContext.editMessage,
      maxNumberOfFiles = _useContext.maxNumberOfFiles,
      multipleUploads = _useContext.multipleUploads,
      sendMessage = _useContext.sendMessage;

  var _useReducer = useReducer(messageInputReducer, message, initState),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  var text = state.text,
      imageOrder = state.imageOrder,
      imageUploads = state.imageUploads,
      fileOrder = state.fileOrder,
      fileUploads = state.fileUploads,
      attachments = state.attachments,
      numberOfUploads = state.numberOfUploads,
      mentioned_users = state.mentioned_users;
  var textareaRef = useRef(
  /** @type {HTMLTextAreaElement | undefined} */
  undefined);
  var emojiPickerRef = useRef(
  /** @type {HTMLDivElement | null} */
  null); // Focus

  useEffect(function () {
    if (focus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [focus]); // Text + cursor position

  var newCursorPosition = useRef(
  /** @type {number | null} */
  null);
  var insertText = useCallback(function (textToInsert) {
    var maxLength = additionalTextareaProps.maxLength;

    if (!textareaRef.current) {
      dispatch({
        type: 'setText',
        getNewText: function getNewText(t) {
          var updatedText = t + textToInsert;

          if (updatedText.length > maxLength) {
            return updatedText.slice(0, maxLength);
          }

          return updatedText;
        }
      });
      return;
    }

    var _textareaRef$current = textareaRef.current,
        selectionStart = _textareaRef$current.selectionStart,
        selectionEnd = _textareaRef$current.selectionEnd;
    newCursorPosition.current = selectionStart + textToInsert.length;
    dispatch({
      type: 'setText',
      getNewText: function getNewText(prevText) {
        var updatedText = prevText.slice(0, selectionStart) + textToInsert + prevText.slice(selectionEnd);

        if (updatedText.length > maxLength) {
          return updatedText.slice(0, maxLength);
        }

        return updatedText;
      }
    });
  }, [additionalTextareaProps, newCursorPosition, textareaRef]);
  useEffect(function () {
    var textareaElement = textareaRef.current;

    if (textareaElement && newCursorPosition.current !== null) {
      textareaElement.selectionStart = newCursorPosition.current;
      textareaElement.selectionEnd = newCursorPosition.current;
      newCursorPosition.current = null;
    }
  }, [text, newCursorPosition]);
  var handleChange = useCallback(function (event) {
    event.preventDefault();

    if (!event || !event.target) {
      return;
    }

    var newText = event.target.value;
    dispatch({
      type: 'setText',
      getNewText: function getNewText() {
        return newText;
      }
    });

    if (publishTypingEvent && newText && channel) {
      logChatPromiseExecution(channel.keystroke(parent === null || parent === void 0 ? void 0 : parent.id), 'start typing event');
    }
  }, [channel, parent, publishTypingEvent]); // Emoji

  var closeEmojiPicker = useCallback(function (e) {
    if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
      dispatch({
        type: 'setEmojiPickerIsOpen',
        value: false
      });
    }
  }, [emojiPickerRef]);
  var openEmojiPicker = useCallback(function (event) {
    dispatch({
      type: 'setEmojiPickerIsOpen',
      value: true
    }); // Prevent event from bubbling to document, so the close handler is never called for this event

    event.stopPropagation();
  }, []);

  var handleEmojiKeyDown = function handleEmojiKeyDown(event) {
    if (event.key === ' ' || event.key === 'Enter' || event.key === 'Spacebar') {
      event.preventDefault();
      openEmojiPicker(event);
    }
  };

  var handleEmojiEscape = function handleEmojiEscape(event) {
    if (event.key === 'Escape') {
      dispatch({
        type: 'setEmojiPickerIsOpen',
        value: false
      });
    }
  };

  useEffect(function () {
    if (state.emojiPickerIsOpen) {
      document.addEventListener('click', closeEmojiPicker, false);
      document.addEventListener('keydown', handleEmojiEscape);
    }

    return function () {
      document.removeEventListener('click', closeEmojiPicker, false);
      document.removeEventListener('keydown', handleEmojiEscape);
    };
  }, [closeEmojiPicker, state.emojiPickerIsOpen]);
  var onSelectEmoji = useCallback(function (emoji) {
    return insertText(emoji.native);
  }, [insertText]); // Commands / mentions

  var getCommands = useCallback(function () {
    var _channel$getConfig;

    return channel === null || channel === void 0 ? void 0 : (_channel$getConfig = channel.getConfig()) === null || _channel$getConfig === void 0 ? void 0 : _channel$getConfig.commands;
  }, [channel]);
  var getUsers = useCallback(function () {
    if (!channel) return [];
    return [].concat(_toConsumableArray(Object.values(channel.state.members).map(function (_ref4) {
      var user = _ref4.user;
      return user;
    })), _toConsumableArray(Object.values(channel.state.watchers))).filter(function (_user, index, self) {
      return self.findIndex(function (user) {
        return (user === null || user === void 0 ? void 0 : user.id) === (_user === null || _user === void 0 ? void 0 : _user.id);
      }) === index;
    } // filter out non-unique ids
    );
  }, [channel]);
  var onSelectItem = useCallback(
  /** @param {UserResponse} item */
  function (item) {
    dispatch({
      type: 'addMentionedUser',
      user: item
    });
  }, []); // Submitting

  var getAttachmentsFromUploads = useCallback(function () {
    var imageAttachments = imageOrder.map(function (id) {
      return imageUploads[id];
    }).filter(function (upload) {
      return upload.state !== 'failed';
    }).filter(function (_ref5, index, self) {
      var id = _ref5.id,
          url = _ref5.url;
      return (// filter out duplicates based on url
        self.every(function (upload) {
          return upload.id === id || upload.url !== url;
        })
      );
    }).map(function (upload) {
      return {
        type: 'image',
        image_url: upload.url,
        fallback: upload.file.name
      };
    });
    var fileAttachments = fileOrder.map(function (id) {
      return fileUploads[id];
    }).filter(function (upload) {
      return upload.state !== 'failed';
    }).map(function (upload) {
      return {
        type: getAttachmentTypeFromMime(upload.file.type),
        asset_url: upload.url,
        title: upload.file.name,
        mime_type: upload.file.type,
        file_size: upload.file.size
      };
    });
    return [].concat(_toConsumableArray(attachments), _toConsumableArray(imageAttachments), _toConsumableArray(fileAttachments));
  }, [imageOrder, imageUploads, fileOrder, fileUploads, attachments]);
  /**
   * @param {React.FormEvent | React.MouseEvent} event
   */

  var handleSubmit = function handleSubmit(event) {
    event.preventDefault();
    var trimmedMessage = text.trim();
    var isEmptyMessage = trimmedMessage === '' || trimmedMessage === '>' || trimmedMessage === '``````' || trimmedMessage === '``' || trimmedMessage === '**' || trimmedMessage === '____' || trimmedMessage === '__' || trimmedMessage === '****';

    if (isEmptyMessage && numberOfUploads === 0) {
      return;
    } // the channel component handles the actual sending of the message


    var someAttachmentsUploading = Object.values(imageUploads).some(function (upload) {
      return upload.state === 'uploading';
    }) || Object.values(fileUploads).some(function (upload) {
      return upload.state === 'uploading';
    });

    if (someAttachmentsUploading) {
      // TODO: show error to user that they should wait until image is uploaded
      return;
    }

    var newAttachments = getAttachmentsFromUploads(); // Instead of checking if a user is still mentioned every time the text changes,
    // just filter out non-mentioned users before submit, which is cheaper
    // and allows users to easily undo any accidental deletion

    var actualMentionedUsers = Array.from(new Set(mentioned_users.filter(function (_ref6) {
      var name = _ref6.name,
          id = _ref6.id;
      return text.includes("@".concat(id)) || text.includes("@".concat(name));
    }).map(function (_ref7) {
      var id = _ref7.id;
      return id;
    })));
    var updatedMessage = {
      text,
      attachments: newAttachments,
      mentioned_users: actualMentionedUsers
    };

    if (!!message && editMessage) {
      // TODO: Remove this line and show an error when submit fails
      if (clearEditingState) clearEditingState();
      var updateMessagePromise = editMessage(_objectSpread$4(_objectSpread$4({}, updatedMessage), {}, {
        id: message.id
      })).then(clearEditingState);
      logChatPromiseExecution(updateMessagePromise, 'update message');
      dispatch({
        type: 'clear'
      });
    } else if (overrideSubmitHandler && typeof overrideSubmitHandler === 'function' && channel) {
      overrideSubmitHandler(_objectSpread$4(_objectSpread$4({}, updatedMessage), {}, {
        parent
      }), channel.cid);
      dispatch({
        type: 'clear'
      });
    } else if (sendMessage) {
      var sendMessagePromise = sendMessage(_objectSpread$4(_objectSpread$4({}, updatedMessage), {}, {
        parent
      }));
      logChatPromiseExecution(sendMessagePromise, 'send message');
      dispatch({
        type: 'clear'
      });
    }

    if (channel && publishTypingEvent) logChatPromiseExecution(channel.stopTyping(), 'stop typing');
  }; // Attachments
  // Files


  var uploadFile = useCallback(function (id) {
    dispatch({
      type: 'setFileUpload',
      id,
      state: 'uploading'
    });
  }, []);
  var removeFile = useCallback(function (id) {
    // TODO: cancel upload if still uploading
    dispatch({
      type: 'removeFileUpload',
      id
    });
  }, []);
  useEffect(function () {
    _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var upload, id, file, response, alreadyRemoved;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (channel) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return");

            case 2:
              upload = Object.values(fileUploads).find(function (fileUpload) {
                return fileUpload.state === 'uploading' && fileUpload.file;
              });

              if (upload) {
                _context.next = 5;
                break;
              }

              return _context.abrupt("return");

            case 5:
              id = upload.id, file = upload.file;
              /** @type FileUploadAPIResponse */

              _context.prev = 6;

              if (!doFileUploadRequest) {
                _context.next = 13;
                break;
              }

              _context.next = 10;
              return doFileUploadRequest(file, channel);

            case 10:
              response = _context.sent;
              _context.next = 16;
              break;

            case 13:
              _context.next = 15;
              return channel.sendFile(file);

            case 15:
              response = _context.sent;

            case 16:
              _context.next = 26;
              break;

            case 18:
              _context.prev = 18;
              _context.t0 = _context["catch"](6);
              console.warn(_context.t0);
              alreadyRemoved = false;
              dispatch({
                type: 'reduceNumberOfUploads'
              });

              if (!fileUploads[id]) {
                alreadyRemoved = true;
              } else {
                dispatch({
                  type: 'setFileUpload',
                  id,
                  state: 'failed'
                });
              }

              if (!alreadyRemoved && errorHandler) {
                // TODO: verify if the parameters passed to the error handler actually make sense
                errorHandler(_context.t0, 'upload-file', file);
              }

              return _context.abrupt("return");

            case 26:
              if (response) {
                _context.next = 29;
                break;
              }

              removeFile(id);
              return _context.abrupt("return");

            case 29:
              dispatch({
                type: 'setFileUpload',
                id,
                state: 'finished',
                url: response.file
              });

            case 30:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[6, 18]]);
    }))();
  }, [fileUploads, channel, doFileUploadRequest, errorHandler, removeFile]); // Images

  var removeImage = useCallback(function (id) {
    dispatch({
      type: 'removeImageUpload',
      id
    }); // TODO: cancel upload if still uploading
  }, []);
  var uploadImage = useCallback( /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(id) {
      var img, file, response, alreadyRemoved;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              img = imageUploads[id];

              if (!(!img || !channel)) {
                _context2.next = 3;
                break;
              }

              return _context2.abrupt("return");

            case 3:
              file = img.file;

              if (img.state !== 'uploading') {
                dispatch({
                  type: 'setImageUpload',
                  id,
                  state: 'uploading'
                });
              }
              /** @type FileUploadAPIResponse */


              _context2.prev = 5;

              if (!doImageUploadRequest) {
                _context2.next = 12;
                break;
              }

              _context2.next = 9;
              return doImageUploadRequest(file, channel);

            case 9:
              response = _context2.sent;
              _context2.next = 15;
              break;

            case 12:
              _context2.next = 14;
              return channel.sendImage(file);

            case 14:
              response = _context2.sent;

            case 15:
              _context2.next = 25;
              break;

            case 17:
              _context2.prev = 17;
              _context2.t0 = _context2["catch"](5);
              console.warn(_context2.t0);
              alreadyRemoved = false;
              dispatch({
                type: 'reduceNumberOfUploads'
              });

              if (!imageUploads[id]) {
                alreadyRemoved = true;
              } else {
                dispatch({
                  type: 'setImageUpload',
                  id,
                  state: 'failed'
                });
              }

              if (!alreadyRemoved && errorHandler) {
                // TODO: verify if the parameters passed to the error handler actually make sense
                errorHandler(_context2.t0, 'upload-image', {
                  id,
                  file
                });
              }

              return _context2.abrupt("return");

            case 25:
              if (response) {
                _context2.next = 28;
                break;
              }

              removeImage(id);
              return _context2.abrupt("return");

            case 28:
              dispatch({
                type: 'setImageUpload',
                id,
                state: 'finished',
                url: response.file
              });

            case 29:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[5, 17]]);
    }));

    return function (_x) {
      return _ref9.apply(this, arguments);
    };
  }(), [imageUploads, channel, doImageUploadRequest, errorHandler, removeImage]);
  useEffect(function () {
    if (FileReader) {
      var upload = Object.values(imageUploads).find(function (imageUpload) {
        return imageUpload.state === 'uploading' && !!imageUpload.file && !imageUpload.previewUri;
      });

      if (upload) {
        var id = upload.id,
            file = upload.file; // TODO: Possibly use URL.createObjectURL instead. However, then we need
        // to release the previews when not used anymore though.

        var reader = new FileReader();

        reader.onload = function (event) {
          var _event$target;

          if (typeof ((_event$target = event.target) === null || _event$target === void 0 ? void 0 : _event$target.result) !== 'string') return;
          dispatch({
            type: 'setImageUpload',
            id,
            previewUri: event.target.result
          });
        };

        reader.readAsDataURL(file);
        uploadImage(id);
        return function () {
          reader.onload = null;
        };
      }
    }

    return function () {};
  }, [imageUploads, uploadImage]); // Number of files that the user can still add. Should never be more than the amount allowed by the API.
  // If multipleUploads is false, we only want to allow a single upload.

  var maxFilesAllowed = useMemo(function () {
    return !multipleUploads ? 1 : maxNumberOfFiles || apiMaxNumberOfFiles;
  }, [maxNumberOfFiles, multipleUploads]); // return !multipleUploads ? 1 : maxNumberOfFiles || apiMaxNumberOfFiles;

  var maxFilesLeft = maxFilesAllowed - numberOfUploads;
  var uploadNewFiles = useCallback(
  /**
   * @param {FileList} files
   */
  function (files) {
    Array.from(files).slice(0, maxFilesLeft).forEach(function (file) {
      var id = generateRandomId();

      if (file.type.startsWith('image/') && !file.type.endsWith('.photoshop') // photoshop files begin with 'image/'
      ) {
          dispatch({
            type: 'setImageUpload',
            id,
            file,
            state: 'uploading'
          });
        } else if (file instanceof File && !noFiles) {
        dispatch({
          type: 'setFileUpload',
          id,
          file,
          state: 'uploading'
        });
      }
    });
  }, [maxFilesLeft, noFiles]);
  var onPaste = useCallback(
  /** (e: React.ClipboardEvent) */
  function (e) {
    (function () {
      var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(event) {
        var items, plainTextPromise, plainTextItem, fileLikes, pastedText;
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                // TODO: Move this handler to package with ImageDropzone
                items = event.clipboardData.items;

                if (dataTransferItemsHaveFiles(items)) {
                  _context3.next = 3;
                  break;
                }

                return _context3.abrupt("return");

              case 3:
                event.preventDefault(); // Get a promise for the plain text in case no files are
                // found. This needs to be done here because chrome cleans
                // up the DataTransferItems after resolving of a promise.

                /** @type {DataTransferItem} */
                plainTextItem = _toConsumableArray(items).find(function (_ref11) {
                  var kind = _ref11.kind,
                      type = _ref11.type;
                  return kind === 'string' && type === 'text/plain';
                });

                if (plainTextItem) {
                  plainTextPromise = new Promise(function (resolve) {
                    plainTextItem.getAsString(function (string) {
                      resolve(string);
                    });
                  });
                }

                _context3.next = 8;
                return dataTransferItemsToFiles(items);

              case 8:
                fileLikes = _context3.sent;

                if (!fileLikes.length) {
                  _context3.next = 12;
                  break;
                }

                uploadNewFiles(fileLikes);
                return _context3.abrupt("return");

              case 12:
                if (!plainTextPromise) {
                  _context3.next = 17;
                  break;
                }

                _context3.next = 15;
                return plainTextPromise;

              case 15:
                pastedText = _context3.sent;
                insertText(pastedText);

              case 17:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      return function (_x2) {
        return _ref10.apply(this, arguments);
      };
    })()(e);
  }, [insertText, uploadNewFiles]);
  var isUploadEnabled = (channel === null || channel === void 0 ? void 0 : (_channel$getConfig2 = channel.getConfig) === null || _channel$getConfig2 === void 0 ? void 0 : (_channel$getConfig2$c = _channel$getConfig2.call(channel)) === null || _channel$getConfig2$c === void 0 ? void 0 : _channel$getConfig2$c.uploads) !== false;
  return _objectSpread$4(_objectSpread$4({}, state), {}, {
    isUploadEnabled,
    maxFilesLeft,
    // refs
    textareaRef,
    emojiPickerRef,
    // handlers
    uploadNewFiles,
    removeImage,
    uploadImage,
    removeFile,
    uploadFile,
    onSelectEmoji,
    getUsers,
    getCommands,
    handleSubmit,
    handleChange,
    onPaste,
    onSelectItem,
    closeEmojiPicker,
    openEmojiPicker,
    handleEmojiKeyDown
  });
}

/** @type { (emoji: import('emoji-mart').EmojiData) => boolean } */

var filterEmoji = function filterEmoji(emoji) {
  if (emoji.name === 'White Smiling Face' || emoji.name === 'White Frowning Face') {
    return false;
  }

  return true;
};
/** @type {React.FC<import("types").MessageInputEmojiPickerProps>} */


var EmojiPicker = function EmojiPicker(_ref) {
  var emojiPickerIsOpen = _ref.emojiPickerIsOpen,
      emojiPickerRef = _ref.emojiPickerRef,
      onSelectEmoji = _ref.onSelectEmoji,
      small = _ref.small;

  var _useContext = useContext(ChannelContext),
      emojiConfig = _useContext.emojiConfig;

  var _useContext2 = useContext(TranslationContext),
      t = _useContext2.t;

  var _ref2 = emojiConfig || {},
      emojiData = _ref2.emojiData,
      Picker = _ref2.EmojiPicker;

  if (emojiPickerIsOpen) {
    var className = small ? 'str-chat__small-message-input-emojipicker' : 'str-chat__input--emojipicker';
    return /*#__PURE__*/React.createElement("div", {
      className: className,
      ref: emojiPickerRef
    }, Picker && /*#__PURE__*/React.createElement(Picker, {
      native: true,
      data: emojiData,
      set: 'facebook',
      emoji: "point_up",
      title: t('Pick your emoji'),
      onSelect: onSelectEmoji,
      color: "#006CFF",
      showPreview: false,
      useButton: true,
      emojisToShowFilter: filterEmoji,
      showSkinTones: false
    }));
  }

  return null;
};

// @ts-check
/** @type {React.FC<import("types").MessageInputUploadsProps>} */

var UploadsPreview = function UploadsPreview(_ref) {
  var imageOrder = _ref.imageOrder,
      imageUploads = _ref.imageUploads,
      removeImage = _ref.removeImage,
      uploadImage = _ref.uploadImage,
      uploadNewFiles = _ref.uploadNewFiles,
      numberOfUploads = _ref.numberOfUploads,
      fileOrder = _ref.fileOrder,
      fileUploads = _ref.fileUploads,
      removeFile = _ref.removeFile,
      uploadFile = _ref.uploadFile;
  var channelContext = useContext(ChannelContext);
  return /*#__PURE__*/React.createElement(React.Fragment, null, imageOrder.length > 0 && /*#__PURE__*/React.createElement(ImagePreviewer, {
    imageUploads: imageOrder.map(function (id) {
      return imageUploads[id];
    }),
    handleRemove: removeImage,
    handleRetry: uploadImage,
    handleFiles: uploadNewFiles,
    multiple: channelContext.multipleUploads,
    disabled: channelContext.maxNumberOfFiles !== undefined && numberOfUploads >= channelContext.maxNumberOfFiles
  }), fileOrder.length > 0 && /*#__PURE__*/React.createElement(FilePreviewer, {
    uploads: fileOrder.map(function (id) {
      return fileUploads[id];
    }),
    handleRemove: removeFile,
    handleRetry: uploadFile,
    handleFiles: uploadNewFiles
  }));
};

/**
 * @type { React.FC }
 */

var EmojiIconLarge = function EmojiIconLarge() {
  var _useContext = useContext(TranslationContext),
      t = _useContext.t;

  return /*#__PURE__*/React.createElement("svg", {
    width: "28",
    height: "28",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("title", null, t('Open emoji picker')), /*#__PURE__*/React.createElement("path", {
    d: "M22.217 16.1c.483.25.674.849.423 1.334C21.163 20.294 17.771 22 14 22c-3.867 0-7.347-1.765-8.66-4.605a.994.994 0 0 1 .9-1.407c.385 0 .739.225.9.575C8.135 18.715 10.892 20 14 20c3.038 0 5.738-1.267 6.879-3.476a.99.99 0 0 1 1.338-.424zm1.583-3.652c.341.443.235 1.064-.237 1.384a1.082 1.082 0 0 1-.62.168c-.338 0-.659-.132-.858-.389-.212-.276-.476-.611-1.076-.611-.598 0-.864.337-1.08.614-.197.254-.517.386-.854.386-.224 0-.438-.045-.62-.167-.517-.349-.578-.947-.235-1.388.66-.847 1.483-1.445 2.789-1.445 1.305 0 2.136.6 2.79 1.448zm-14 0c.341.443.235 1.064-.237 1.384a1.082 1.082 0 0 1-.62.168c-.339 0-.659-.132-.858-.389C7.873 13.335 7.61 13 7.01 13c-.598 0-.864.337-1.08.614-.197.254-.517.386-.854.386-.224 0-.438-.045-.62-.167-.518-.349-.579-.947-.235-1.388C4.88 11.598 5.703 11 7.01 11c1.305 0 2.136.6 2.79 1.448zM14 0c7.732 0 14 6.268 14 14s-6.268 14-14 14S0 21.732 0 14 6.268 0 14 0zm8.485 22.485A11.922 11.922 0 0 0 26 14c0-3.205-1.248-6.219-3.515-8.485A11.922 11.922 0 0 0 14 2a11.922 11.922 0 0 0-8.485 3.515A11.922 11.922 0 0 0 2 14c0 3.205 1.248 6.219 3.515 8.485A11.922 11.922 0 0 0 14 26c3.205 0 6.219-1.248 8.485-3.515z",
    fillRule: "evenodd"
  }));
};
/**
 * @type { React.FC }
 */

var EmojiIconSmall = function EmojiIconSmall() {
  var _useContext2 = useContext(TranslationContext),
      t = _useContext2.t;

  return /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("title", null, t('Open emoji picker')), /*#__PURE__*/React.createElement("path", {
    d: "M11.108 8.05a.496.496 0 0 1 .212.667C10.581 10.147 8.886 11 7 11c-1.933 0-3.673-.882-4.33-2.302a.497.497 0 0 1 .9-.417C4.068 9.357 5.446 10 7 10c1.519 0 2.869-.633 3.44-1.738a.495.495 0 0 1 .668-.212zm.792-1.826a.477.477 0 0 1-.119.692.541.541 0 0 1-.31.084.534.534 0 0 1-.428-.194c-.106-.138-.238-.306-.539-.306-.298 0-.431.168-.54.307A.534.534 0 0 1 9.538 7a.544.544 0 0 1-.31-.084.463.463 0 0 1-.117-.694c.33-.423.742-.722 1.394-.722.653 0 1.068.3 1.396.724zm-7 0a.477.477 0 0 1-.119.692.541.541 0 0 1-.31.084.534.534 0 0 1-.428-.194c-.106-.138-.238-.306-.539-.306-.299 0-.432.168-.54.307A.533.533 0 0 1 2.538 7a.544.544 0 0 1-.31-.084.463.463 0 0 1-.117-.694c.33-.423.742-.722 1.394-.722.653 0 1.068.3 1.396.724zM7 0a7 7 0 1 1 0 14A7 7 0 0 1 7 0zm4.243 11.243A5.96 5.96 0 0 0 13 7a5.96 5.96 0 0 0-1.757-4.243A5.96 5.96 0 0 0 7 1a5.96 5.96 0 0 0-4.243 1.757A5.96 5.96 0 0 0 1 7a5.96 5.96 0 0 0 1.757 4.243A5.96 5.96 0 0 0 7 13a5.96 5.96 0 0 0 4.243-1.757z",
    fillRule: "evenodd"
  }));
};
/**
 * @type { React.FC }
 */

var FileUploadIcon = function FileUploadIcon() {
  var _useContext3 = useContext(TranslationContext),
      t = _useContext3.t;

  return /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("title", null, t('Attach files')), /*#__PURE__*/React.createElement("path", {
    d: "M7 .5c3.59 0 6.5 2.91 6.5 6.5s-2.91 6.5-6.5 6.5S.5 10.59.5 7 3.41.5 7 .5zm0 12c3.031 0 5.5-2.469 5.5-5.5S10.031 1.5 7 1.5A5.506 5.506 0 0 0 1.5 7c0 3.034 2.469 5.5 5.5 5.5zM7.506 3v3.494H11v1.05H7.506V11h-1.05V7.544H3v-1.05h3.456V3h1.05z",
    fillRule: "nonzero"
  }));
};
/**
 * @type { React.FC }
 */

var FileUploadIconFlat = function FileUploadIconFlat() {
  var _useContext4 = useContext(TranslationContext),
      t = _useContext4.t;

  return /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("title", null, t('Attach files')), /*#__PURE__*/React.createElement("path", {
    d: "M1.667.333h10.666c.737 0 1.334.597 1.334 1.334v10.666c0 .737-.597 1.334-1.334 1.334H1.667a1.333 1.333 0 0 1-1.334-1.334V1.667C.333.93.93.333 1.667.333zm2 1.334a1.667 1.667 0 1 0 0 3.333 1.667 1.667 0 0 0 0-3.333zm-2 9.333v1.333h10.666v-4l-2-2-4 4-2-2L1.667 11z",
    fillRule: "nonzero"
  }));
};
/**
 * @type { React.FC<import('../types').SendButtonProps> }
 */

function SendButton(_ref) {
  var sendMessage = _ref.sendMessage;

  var _useContext5 = useContext(TranslationContext),
      t = _useContext5.t;

  return /*#__PURE__*/React.createElement("button", {
    className: "str-chat__send-button",
    onClick: sendMessage
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "17",
    viewBox: "0 0 18 17",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("title", null, t('Send')), /*#__PURE__*/React.createElement("path", {
    d: "M0 17.015l17.333-8.508L0 0v6.617l12.417 1.89L0 10.397z",
    fillRule: "evenodd",
    fill: "#006cff"
  })));
}

// @ts-check
/** @type {React.FC<import("types").MessageInputProps>} */

var MessageInputLarge = function MessageInputLarge(props) {
  var _props$EmojiIcon = props.EmojiIcon,
      EmojiIcon = _props$EmojiIcon === void 0 ? EmojiIconSmall : _props$EmojiIcon,
      _props$FileUploadIcon = props.FileUploadIcon,
      FileUploadIcon$1 = _props$FileUploadIcon === void 0 ? FileUploadIcon : _props$FileUploadIcon,
      _props$SendButton = props.SendButton,
      SendButton$1 = _props$SendButton === void 0 ? SendButton : _props$SendButton;
  var channelContext = useContext(ChannelContext);

  var _useContext = useContext(TranslationContext),
      t = _useContext.t;

  var messageInput = useMessageInput(props);
  /**
   * @typedef {import("stream-chat").Event} ClientEvent
   * @param {{ [userid: string]: ClientEvent } | {}} typingUsers
   */

  var constructTypingString = function constructTypingString(typingUsers) {
    var otherTypingUsers = Object.values(typingUsers).filter(function (_ref) {
      var _channelContext$clien, _channelContext$clien2;

      var user = _ref.user;
      return ((_channelContext$clien = channelContext.client) === null || _channelContext$clien === void 0 ? void 0 : (_channelContext$clien2 = _channelContext$clien.user) === null || _channelContext$clien2 === void 0 ? void 0 : _channelContext$clien2.id) !== (user === null || user === void 0 ? void 0 : user.id);
    }).map(function (_ref2) {
      var user = _ref2.user;
      return (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.id);
    });
    if (otherTypingUsers.length === 0) return '';

    if (otherTypingUsers.length === 1) {
      return t('{{ user }} is typing...', {
        user: otherTypingUsers[0]
      });
    }

    if (otherTypingUsers.length === 2) {
      // joins all with "and" but =no commas
      // example: "bob and sam"
      return t('{{ firstUser }} and {{ secondUser }} are typing...', {
        firstUser: otherTypingUsers[0],
        secondUser: otherTypingUsers[1]
      });
    } // joins all with commas, but last one gets ", and" (oxford comma!)
    // example: "bob, joe, and sam"


    return t('{{ commaSeparatedUsers }} and {{ lastUser }} are typing...', {
      commaSeparatedUsers: otherTypingUsers.slice(0, -1).join(', '),
      lastUser: otherTypingUsers[otherTypingUsers.length - 1]
    });
  };

  return /*#__PURE__*/React.createElement("div", {
    className: "str-chat__input-large"
  }, /*#__PURE__*/React.createElement(ImageDropzone, {
    accept: channelContext.acceptedFiles,
    multiple: channelContext.multipleUploads,
    disabled: !messageInput.isUploadEnabled || messageInput.maxFilesLeft === 0,
    maxNumberOfFiles: messageInput.maxFilesLeft,
    handleFiles: messageInput.uploadNewFiles
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__input"
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__input--textarea-wrapper"
  }, messageInput.isUploadEnabled && /*#__PURE__*/React.createElement(UploadsPreview, messageInput), /*#__PURE__*/React.createElement(ChatAutoComplete$1, {
    commands: messageInput.getCommands(),
    innerRef: messageInput.textareaRef,
    handleSubmit: messageInput.handleSubmit,
    onChange: messageInput.handleChange,
    onSelectItem: messageInput.onSelectItem,
    value: messageInput.text,
    rows: 1,
    maxRows: props.maxRows,
    placeholder: t('Type your message'),
    onPaste: messageInput.onPaste,
    triggers: props.autocompleteTriggers,
    grow: props.grow,
    disabled: props.disabled,
    disableMentions: props.disableMentions,
    SuggestionList: props.SuggestionList,
    additionalTextareaProps: props.additionalTextareaProps
  }), messageInput.isUploadEnabled && /*#__PURE__*/React.createElement("div", {
    className: "str-chat__fileupload-wrapper",
    "data-testid": "fileinput"
  }, /*#__PURE__*/React.createElement(Tooltip$1, null, messageInput.maxFilesLeft ? t('Attach files') : t("You've reached the maximum number of files")), /*#__PURE__*/React.createElement(FileUploadButton, {
    multiple: channelContext.multipleUploads,
    disabled: messageInput.maxFilesLeft === 0,
    accepts: channelContext.acceptedFiles,
    handleFiles: messageInput.uploadNewFiles
  }, /*#__PURE__*/React.createElement("span", {
    className: "str-chat__input-fileupload"
  }, /*#__PURE__*/React.createElement(FileUploadIcon$1, null)))), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__emojiselect-wrapper"
  }, /*#__PURE__*/React.createElement(Tooltip$1, null, messageInput.emojiPickerIsOpen ? t('Close emoji picker') : t('Open emoji picker')), /*#__PURE__*/React.createElement("span", {
    className: "str-chat__input-emojiselect",
    onClick: messageInput.emojiPickerIsOpen ? messageInput.closeEmojiPicker : messageInput.openEmojiPicker,
    onKeyDown: messageInput.handleEmojiKeyDown,
    ref: messageInput.emojiPickerRef,
    role: "button",
    tabIndex: 0
  }, /*#__PURE__*/React.createElement(EmojiIcon, null))), /*#__PURE__*/React.createElement(EmojiPicker, messageInput)), SendButton$1 && /*#__PURE__*/React.createElement(SendButton$1, {
    sendMessage: messageInput.handleSubmit
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__input-footer"
  }, /*#__PURE__*/React.createElement("span", {
    className: "str-chat__input-footer--count ".concat(!channelContext.watcher_count ? 'str-chat__input-footer--count--hidden' : '')
  }, t('{{ watcherCount }} online', {
    watcherCount: channelContext.watcher_count
  })), /*#__PURE__*/React.createElement("span", {
    className: "str-chat__input-footer--typing"
  }, constructTypingString(channelContext.typing || {}))))));
};

MessageInputLarge.propTypes = {
  /** Set focus to the text input if this is enabled */
  focus: PropTypes.bool.isRequired,

  /** Grow the textarea while you're typing */
  grow: PropTypes.bool.isRequired,

  /** Specify the max amount of rows the textarea is able to grow */
  maxRows: PropTypes.number.isRequired,

  /** Make the textarea disabled */
  disabled: PropTypes.bool,

  /** Disable mentions in textarea */
  disableMentions: PropTypes.bool,

  /** enable/disable firing the typing event */
  publishTypingEvent: PropTypes.bool,

  /**
   * Any additional attributes that you may want to add for underlying HTML textarea element.
   */
  additionalTextareaProps:
  /** @type {PropTypes.Validator<React.TextareaHTMLAttributes<import('../types').AnyType>>} */
  PropTypes.object,

  /**
   * Override the default triggers of the ChatAutoComplete component
   */
  autocompleteTriggers: PropTypes.object,

  /**
   * @param message: the Message object to be sent
   * @param cid: the channel id
   */
  overrideSubmitHandler: PropTypes.func,

  /** Override image upload request */
  doImageUploadRequest: PropTypes.func,

  /** Override file upload request */
  doFileUploadRequest: PropTypes.func,

  /**
   * Custom UI component for emoji button in input.
   *
   * Defaults to and accepts same props as: [EmojiIconSmall](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/icons.js)
   * */
  EmojiIcon:
  /** @type {PropTypes.Validator<React.FC>} */
  PropTypes.elementType,

  /**
   * Custom UI component for file upload button in input.
   *
   * Defaults to and accepts same props as: [FileUploadIcon](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/icons.js)
   * */
  FileUploadIcon:
  /** @type {PropTypes.Validator<React.FC>} */
  PropTypes.elementType,

  /**
   * Custom UI component for send button.
   *
   * Defaults to and accepts same props as: [SendButton](https://getstream.github.io/stream-chat-react/#sendbutton)
   * */
  SendButton:
  /** @type {PropTypes.Validator<React.FC<import('../types').SendButtonProps>>} */
  PropTypes.elementType,

  /** Optional UI component prop to override the default List component that displays suggestions */
  SuggestionList:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').SuggestionListProps>>} */
  PropTypes.elementType
};
MessageInputLarge.defaultProps = {
  focus: false,
  disabled: false,
  publishTypingEvent: true,
  grow: true,
  maxRows: 10,
  Input: MessageInputLarge,
  additionalTextareaProps: {}
};

var MessageInput = function MessageInput(props) {
  var Input = props.Input;
  return /*#__PURE__*/React.createElement(Input, props);
};

MessageInput.defaultProps = {
  focus: false,
  disabled: false,
  publishTypingEvent: true,
  grow: true,
  maxRows: 10,
  Input: MessageInputLarge,
  additionalTextareaProps: {}
};
var MessageInput$1 = /*#__PURE__*/React.memo(MessageInput);

// @ts-check
/** @type {React.FC<import("types").MessageInputProps>} */

var MessageInputFlat = function MessageInputFlat(props) {
  var _props$EmojiIcon = props.EmojiIcon,
      EmojiIcon = _props$EmojiIcon === void 0 ? EmojiIconLarge : _props$EmojiIcon,
      _props$FileUploadIcon = props.FileUploadIcon,
      FileUploadIcon = _props$FileUploadIcon === void 0 ? FileUploadIconFlat : _props$FileUploadIcon,
      _props$SendButton = props.SendButton,
      SendButton$1 = _props$SendButton === void 0 ? SendButton : _props$SendButton;
  var channelContext = useContext(ChannelContext);

  var _useContext = useContext(TranslationContext),
      t = _useContext.t;

  var messageInput = useMessageInput(props);
  return /*#__PURE__*/React.createElement("div", {
    className: "str-chat__input-flat ".concat(SendButton$1 ? 'str-chat__input-flat--send-button-active' : null)
  }, /*#__PURE__*/React.createElement(ImageDropzone, {
    accept: channelContext.acceptedFiles,
    multiple: channelContext.multipleUploads,
    disabled: !messageInput.isUploadEnabled || messageInput.maxFilesLeft === 0,
    maxNumberOfFiles: messageInput.maxFilesLeft,
    handleFiles: messageInput.uploadNewFiles
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__input-flat-wrapper"
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__input-flat--textarea-wrapper"
  }, messageInput.isUploadEnabled && /*#__PURE__*/React.createElement(UploadsPreview, messageInput), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__emojiselect-wrapper"
  }, /*#__PURE__*/React.createElement(Tooltip$1, null, messageInput.emojiPickerIsOpen ? t('Close emoji picker') : t('Open emoji picker')), /*#__PURE__*/React.createElement("span", {
    className: "str-chat__input-flat-emojiselect",
    onClick: messageInput.emojiPickerIsOpen ? messageInput.closeEmojiPicker : messageInput.openEmojiPicker,
    onKeyDown: messageInput.handleEmojiKeyDown,
    role: "button",
    tabIndex: 0
  }, /*#__PURE__*/React.createElement(EmojiIcon, null))), /*#__PURE__*/React.createElement(EmojiPicker, messageInput), /*#__PURE__*/React.createElement(ChatAutoComplete$1, {
    commands: messageInput.getCommands(),
    innerRef: messageInput.textareaRef,
    handleSubmit: messageInput.handleSubmit,
    onSelectItem: messageInput.onSelectItem,
    onChange: messageInput.handleChange,
    value: messageInput.text,
    rows: 1,
    maxRows: props.maxRows,
    placeholder: t('Type your message'),
    onPaste: messageInput.onPaste,
    triggers: props.autocompleteTriggers,
    grow: props.grow,
    disabled: props.disabled,
    disableMentions: props.disableMentions,
    SuggestionList: props.SuggestionList,
    additionalTextareaProps: props.additionalTextareaProps
  }), messageInput.isUploadEnabled && /*#__PURE__*/React.createElement("div", {
    className: "str-chat__fileupload-wrapper",
    "data-testid": "fileinput"
  }, /*#__PURE__*/React.createElement(Tooltip$1, null, messageInput.maxFilesLeft ? t('Attach files') : t("You've reached the maximum number of files")), /*#__PURE__*/React.createElement(FileUploadButton, {
    multiple: channelContext.multipleUploads,
    disabled: messageInput.maxFilesLeft === 0,
    accepts: channelContext.acceptedFiles,
    handleFiles: messageInput.uploadNewFiles
  }, /*#__PURE__*/React.createElement("span", {
    className: "str-chat__input-flat-fileupload"
  }, /*#__PURE__*/React.createElement(FileUploadIcon, null))))), SendButton$1 && /*#__PURE__*/React.createElement(SendButton$1, {
    sendMessage: messageInput.handleSubmit
  }))));
};

MessageInputFlat.propTypes = {
  /** Set focus to the text input if this is enabled */
  focus: PropTypes.bool.isRequired,

  /** Grow the textarea while you're typing */
  grow: PropTypes.bool.isRequired,

  /** Specify the max amount of rows the textarea is able to grow */
  maxRows: PropTypes.number.isRequired,

  /** Make the textarea disabled */
  disabled: PropTypes.bool,

  /** Disable mentions in textarea */
  disableMentions: PropTypes.bool,

  /** enable/disable firing the typing event */
  publishTypingEvent: PropTypes.bool,

  /**
   * Any additional attributes that you may want to add for underlying HTML textarea element.
   */
  additionalTextareaProps:
  /** @type {PropTypes.Validator<React.TextareaHTMLAttributes<import('../types').AnyType>>} */
  PropTypes.object,

  /**
   * Override the default triggers of the ChatAutoComplete component
   */
  autocompleteTriggers: PropTypes.object,

  /**
   * @param message: the Message object to be sent
   * @param cid: the channel id
   */
  overrideSubmitHandler: PropTypes.func,

  /** Override image upload request */
  doImageUploadRequest: PropTypes.func,

  /** Override file upload request */
  doFileUploadRequest: PropTypes.func,

  /**
   * Custom UI component for emoji button in input.
   *
   * Defaults to and accepts same props as: [EmojiIconLarge](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/icons.js)
   * */
  EmojiIcon:
  /** @type {PropTypes.Validator<React.FC>} */
  PropTypes.elementType,

  /**
   * Custom UI component for file upload button in input.
   *
   * Defaults to and accepts same props as: [FileUploadIconFlat](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/icons.js)
   * */
  FileUploadIcon:
  /** @type {PropTypes.Validator<React.FC>} */
  PropTypes.elementType,

  /**
   * Custom UI component for send button.
   *
   * Defaults to and accepts same props as: [SendButton](https://getstream.github.io/stream-chat-react/#sendbutton)
   * */
  SendButton:
  /** @type {PropTypes.Validator<React.FC<import('../types').SendButtonProps>>} */
  PropTypes.elementType,

  /** Optional UI component prop to override the default List component that displays suggestions */
  SuggestionList:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').SuggestionListProps>>} */
  PropTypes.elementType
};
MessageInputFlat.defaultProps = {
  focus: false,
  disabled: false,
  publishTypingEvent: true,
  grow: true,
  maxRows: 10,
  additionalTextareaProps: {}
};

/** @type {React.FC<import("types").MessageInputProps>} */

var MessageInputSmall = function MessageInputSmall(props) {
  var _props$EmojiIcon = props.EmojiIcon,
      EmojiIcon = _props$EmojiIcon === void 0 ? EmojiIconSmall : _props$EmojiIcon,
      _props$FileUploadIcon = props.FileUploadIcon,
      FileUploadIcon$1 = _props$FileUploadIcon === void 0 ? FileUploadIcon : _props$FileUploadIcon,
      _props$SendButton = props.SendButton,
      SendButton$1 = _props$SendButton === void 0 ? SendButton : _props$SendButton;
  var channelContext = useContext(ChannelContext);

  var _useContext = useContext(TranslationContext),
      t = _useContext.t;

  var messageInput = useMessageInput(props);
  return /*#__PURE__*/React.createElement("div", {
    className: "str-chat__small-message-input__wrapper"
  }, /*#__PURE__*/React.createElement(ImageDropzone, {
    accept: channelContext.acceptedFiles,
    multiple: channelContext.multipleUploads,
    disabled: !messageInput.isUploadEnabled || messageInput.maxFilesLeft === 0,
    maxNumberOfFiles: messageInput.maxFilesLeft,
    handleFiles: messageInput.uploadNewFiles
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__small-message-input ".concat(SendButton$1 ? 'str-chat__small-message-input--send-button-active' : null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__small-message-input--textarea-wrapper"
  }, messageInput.isUploadEnabled && /*#__PURE__*/React.createElement(UploadsPreview, messageInput), /*#__PURE__*/React.createElement(ChatAutoComplete$1, {
    commands: messageInput.getCommands(),
    innerRef: messageInput.textareaRef,
    handleSubmit: messageInput.handleSubmit,
    onChange: messageInput.handleChange,
    value: messageInput.text,
    rows: 1,
    maxRows: props.maxRows,
    onSelectItem: messageInput.onSelectItem,
    placeholder: t('Type your message'),
    onPaste: messageInput.onPaste,
    triggers: props.autocompleteTriggers,
    grow: props.grow,
    disabled: props.disabled,
    disableMentions: props.disableMentions,
    SuggestionList: props.SuggestionList,
    additionalTextareaProps: props.additionalTextareaProps
  }), messageInput.isUploadEnabled && /*#__PURE__*/React.createElement("div", {
    className: "str-chat__fileupload-wrapper",
    "data-testid": "fileinput"
  }, /*#__PURE__*/React.createElement(Tooltip$1, null, messageInput.maxFilesLeft ? t('Attach files') : t("You've reached the maximum number of files")), /*#__PURE__*/React.createElement(FileUploadButton, {
    multiple: channelContext.multipleUploads,
    disabled: messageInput.maxFilesLeft === 0,
    accepts: channelContext.acceptedFiles,
    handleFiles: messageInput.uploadNewFiles
  }, /*#__PURE__*/React.createElement("span", {
    className: "str-chat__small-message-input-fileupload"
  }, /*#__PURE__*/React.createElement(FileUploadIcon$1, null)))), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__emojiselect-wrapper"
  }, /*#__PURE__*/React.createElement(Tooltip$1, null, messageInput.emojiPickerIsOpen ? t('Close emoji picker') : t('Open emoji picker')), /*#__PURE__*/React.createElement("span", {
    className: "str-chat__small-message-input-emojiselect",
    onClick: messageInput.emojiPickerIsOpen ? messageInput.closeEmojiPicker : messageInput.openEmojiPicker,
    onKeyDown: messageInput.handleEmojiKeyDown,
    role: "button",
    tabIndex: 0
  }, /*#__PURE__*/React.createElement(EmojiIcon, null))), /*#__PURE__*/React.createElement(EmojiPicker, _extends({}, messageInput, {
    small: true
  }))), SendButton$1 && /*#__PURE__*/React.createElement(SendButton$1, {
    sendMessage: messageInput.handleSubmit
  }))));
};

MessageInputSmall.propTypes = {
  /** Set focus to the text input if this is enabled */
  focus: PropTypes.bool.isRequired,

  /** Grow the textarea while you're typing */
  grow: PropTypes.bool.isRequired,

  /** Specify the max amount of rows the textarea is able to grow */
  maxRows: PropTypes.number.isRequired,

  /** Make the textarea disabled */
  disabled: PropTypes.bool,

  /** Disable mentions in textarea */
  disableMentions: PropTypes.bool,

  /** enable/disable firing the typing event */
  publishTypingEvent: PropTypes.bool,

  /**
   * Any additional attributes that you may want to add for underlying HTML textarea element.
   */
  additionalTextareaProps:
  /** @type {PropTypes.Validator<React.TextareaHTMLAttributes<import('../types').AnyType>>} */
  PropTypes.object,

  /**
   * Override the default triggers of the ChatAutoComplete component
   */
  autocompleteTriggers: PropTypes.object,

  /**
   * @param message: the Message object to be sent
   * @param cid: the channel id
   */
  overrideSubmitHandler: PropTypes.func,

  /** Override image upload request */
  doImageUploadRequest: PropTypes.func,

  /** Override file upload request */
  doFileUploadRequest: PropTypes.func,

  /**
   * Custom UI component for emoji button in input.
   *
   * Defaults to and accepts same props as: [EmojiIconSmall](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/icons.js)
   * */
  EmojiIcon:
  /** @type {PropTypes.Validator<React.FC>} */
  PropTypes.elementType,

  /**
   * Custom UI component for file upload button in input.
   *
   * Defaults to and accepts same props as: [FileUploadIcon](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/icons.js)
   * */
  FileUploadIcon:
  /** @type {PropTypes.Validator<React.FC>} */
  PropTypes.elementType,

  /**
   * Custom UI component for send button.
   *
   * Defaults to and accepts same props as: [SendButton](https://getstream.github.io/stream-chat-react/#sendbutton)
   * */
  SendButton:
  /** @type {PropTypes.Validator<React.FC<import('../types').SendButtonProps>>} */
  PropTypes.elementType,

  /** Optional UI component prop to override the default List component that displays suggestions */
  SuggestionList:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').SuggestionListProps>>} */
  PropTypes.elementType
};
MessageInputSmall.defaultProps = {
  focus: false,
  disabled: false,
  publishTypingEvent: true,
  grow: true,
  maxRows: 10,
  additionalTextareaProps: {}
};

// @ts-check
/** @type {React.FC<import("types").MessageInputProps>} */

var MessageInputSimple = function MessageInputSimple(props) {
  var _props$EmojiIcon = props.EmojiIcon,
      EmojiIcon = _props$EmojiIcon === void 0 ? EmojiIconLarge : _props$EmojiIcon,
      _props$SendButton = props.SendButton,
      SendButton$1 = _props$SendButton === void 0 ? SendButton : _props$SendButton;

  var _useContext = useContext(TranslationContext),
      t = _useContext.t;

  var messageInput = useMessageInput(props);
  return /*#__PURE__*/React.createElement("div", {
    className: "str-chat__input-flat ".concat(SendButton$1 ? 'str-chat__input-flat--send-button-active' : null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__input-flat-wrapper"
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__input-flat--textarea-wrapper"
  }, /*#__PURE__*/React.createElement(ChatAutoComplete$1, {
    commands: messageInput.getCommands(),
    innerRef: messageInput.textareaRef,
    handleSubmit: messageInput.handleSubmit,
    onSelectItem: messageInput.onSelectItem,
    onChange: messageInput.handleChange,
    value: messageInput.text,
    rows: 1,
    maxRows: props.maxRows,
    placeholder: t('Type your message'),
    onPaste: messageInput.onPaste,
    triggers: props.autocompleteTriggers,
    grow: props.grow,
    disabled: props.disabled,
    disableMentions: props.disableMentions,
    SuggestionList: props.SuggestionList,
    additionalTextareaProps: props.additionalTextareaProps
  }), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__emojiselect-wrapper"
  }, /*#__PURE__*/React.createElement(Tooltip$1, null, messageInput.emojiPickerIsOpen ? t('Close emoji picker') : t('Open emoji picker')), /*#__PURE__*/React.createElement("span", {
    className: "str-chat__input-flat-emojiselect",
    onClick: messageInput.emojiPickerIsOpen ? messageInput.closeEmojiPicker : messageInput.openEmojiPicker,
    onKeyDown: messageInput.handleEmojiKeyDown,
    role: "button",
    tabIndex: 0
  }, /*#__PURE__*/React.createElement(EmojiIcon, null))), /*#__PURE__*/React.createElement(EmojiPicker, messageInput)), SendButton$1 && /*#__PURE__*/React.createElement(SendButton$1, {
    sendMessage: messageInput.handleSubmit
  })));
};

MessageInputSimple.propTypes = {
  /** Set focus to the text input if this is enabled */
  focus: PropTypes.bool.isRequired,

  /** Grow the textarea while you're typing */
  grow: PropTypes.bool.isRequired,

  /** Specify the max amount of rows the textarea is able to grow */
  maxRows: PropTypes.number.isRequired,

  /** Make the textarea disabled */
  disabled: PropTypes.bool,

  /** Disable mentions in textarea */
  disableMentions: PropTypes.bool,

  /** enable/disable firing the typing event */
  publishTypingEvent: PropTypes.bool,

  /**
   * Any additional attributes that you may want to add for underlying HTML textarea element.
   */
  additionalTextareaProps:
  /** @type {PropTypes.Validator<React.TextareaHTMLAttributes<import('../types').AnyType>>} */
  PropTypes.object,

  /**
   * Override the default triggers of the ChatAutoComplete component
   */
  autocompleteTriggers: PropTypes.object,

  /**
   * @param message: the Message object to be sent
   * @param cid: the channel id
   */
  overrideSubmitHandler: PropTypes.func,

  /** Override image upload request */
  doImageUploadRequest: PropTypes.func,

  /** Override file upload request */
  doFileUploadRequest: PropTypes.func,

  /**
   * Custom UI component for emoji button in input.
   *
   * Defaults to and accepts same props as: [EmojiIconLarge](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/icons.js)
   * */
  EmojiIcon:
  /** @type {PropTypes.Validator<React.FC>} */
  PropTypes.elementType,

  /**
   * Custom UI component for send button.
   *
   * Defaults to and accepts same props as: [SendButton](https://getstream.github.io/stream-chat-react/#sendbutton)
   * */
  SendButton:
  /** @type {PropTypes.Validator<React.FC<import('../types').SendButtonProps>>} */
  PropTypes.elementType,

  /** Optional UI component prop to override the default List component that displays suggestions */
  SuggestionList:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').SuggestionListProps>>} */
  PropTypes.elementType
};
MessageInputSimple.defaultProps = {
  focus: false,
  disabled: false,
  publishTypingEvent: true,
  grow: true,
  maxRows: 10,
  additionalTextareaProps: {}
};

/** @type {React.FC<import("types").MessageInputProps>} */

var EditMessageForm = function EditMessageForm(props) {
  var clearEditingState = props.clearEditingState,
      _props$EmojiIcon = props.EmojiIcon,
      EmojiIcon = _props$EmojiIcon === void 0 ? EmojiIconSmall : _props$EmojiIcon,
      _props$FileUploadIcon = props.FileUploadIcon,
      FileUploadIcon$1 = _props$FileUploadIcon === void 0 ? FileUploadIcon : _props$FileUploadIcon;
  var channelContext = useContext(ChannelContext);

  var _useContext = useContext(TranslationContext),
      t = _useContext.t;

  var messageInput = useMessageInput(props);
  useEffect(function () {
    /** @type {(event: KeyboardEvent) => void} Typescript syntax */
    var onKeyDown = function onKeyDown(event) {
      if (event.keyCode === KEY_CODES.ESC && clearEditingState) clearEditingState();
    };

    document.addEventListener('keydown', onKeyDown);
    return function () {
      return document.removeEventListener('keydown', onKeyDown);
    };
  }, [clearEditingState]);
  return /*#__PURE__*/React.createElement("div", {
    className: "str-chat__edit-message-form"
  }, /*#__PURE__*/React.createElement(ImageDropzone, {
    accept: channelContext.acceptedFiles,
    multiple: channelContext.multipleUploads,
    disabled: !messageInput.isUploadEnabled || messageInput.maxFilesLeft === 0,
    maxNumberOfFiles: messageInput.maxFilesLeft,
    handleFiles: messageInput.uploadNewFiles
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: messageInput.handleSubmit
  }, messageInput.isUploadEnabled && /*#__PURE__*/React.createElement(UploadsPreview, messageInput), /*#__PURE__*/React.createElement(EmojiPicker, _extends({}, messageInput, {
    small: true
  })), /*#__PURE__*/React.createElement(ChatAutoComplete$1, {
    commands: messageInput.getCommands(),
    innerRef: messageInput.textareaRef,
    handleSubmit: messageInput.handleSubmit,
    onChange: messageInput.handleChange,
    onSelectItem: messageInput.onSelectItem,
    placeholder: t('Type your message'),
    value: messageInput.text,
    rows: 1,
    maxRows: props.maxRows,
    onPaste: messageInput.onPaste,
    grow: props.grow,
    additionalTextareaProps: props.additionalTextareaProps
  }), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__message-team-form-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__edit-message-form-options"
  }, /*#__PURE__*/React.createElement("span", {
    className: "str-chat__input-emojiselect",
    onClick: messageInput.openEmojiPicker
  }, /*#__PURE__*/React.createElement(EmojiIcon, null)), messageInput.isUploadEnabled && /*#__PURE__*/React.createElement("div", {
    className: "str-chat__fileupload-wrapper",
    "data-testid": "fileinput"
  }, /*#__PURE__*/React.createElement(Tooltip$1, null, messageInput.maxFilesLeft ? t('Attach files') : t("You've reached the maximum number of files")), /*#__PURE__*/React.createElement(FileUploadButton, {
    multiple: channelContext.multipleUploads,
    disabled: messageInput.maxFilesLeft === 0,
    accepts: channelContext.acceptedFiles,
    handleFiles: messageInput.uploadNewFiles
  }, /*#__PURE__*/React.createElement("span", {
    className: "str-chat__input-fileupload"
  }, /*#__PURE__*/React.createElement(FileUploadIcon$1, null))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      if (props.clearEditingState) {
        props.clearEditingState();
      }
    }
  }, t('Cancel')), /*#__PURE__*/React.createElement("button", {
    type: "submit"
  }, t('Send')))))));
};

EditMessageForm.propTypes = {
  /** Set focus to the text input if this is enabled */
  focus: PropTypes.bool.isRequired,

  /** Grow the textarea while you're typing */
  grow: PropTypes.bool.isRequired,

  /** Specify the max amount of rows the textarea is able to grow */
  maxRows: PropTypes.number.isRequired,

  /** Make the textarea disabled */
  disabled: PropTypes.bool,

  /** enable/disable firing the typing event */
  publishTypingEvent: PropTypes.bool,

  /**
   * Any additional attrubutes that you may want to add for underlying HTML textarea element.
   */
  additionalTextareaProps: PropTypes.object,

  /**
   * @param message: the Message object to be sent
   * @param cid: the channel id
   */
  overrideSubmitHandler: PropTypes.func,

  /** Override image upload request */
  doImageUploadRequest: PropTypes.func,

  /** Override file upload request */
  doFileUploadRequest: PropTypes.func,

  /**
   * Custom UI component for emoji button in input.
   *
   * Defaults to and accepts same props as: [EmojiIconSmall](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/icons.js)
   * */
  EmojiIcon:
  /** @type {PropTypes.Validator<React.FC>} */
  PropTypes.elementType,

  /**
   * Custom UI component for file upload button in input.
   *
   * Defaults to and accepts same props as: [FileUploadIcon](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/icons.js)
   * */
  FileUploadIcon:
  /** @type {PropTypes.Validator<React.FC>} */
  PropTypes.elementType,

  /**
   * Custom UI component for send button.
   *
   * Defaults to and accepts same props as: [SendButton](https://getstream.github.io/stream-chat-react/#sendbutton)
   * */
  SendButton:
  /** @type {PropTypes.Validator<React.FC<import('../types').SendButtonProps>>} */
  PropTypes.elementType,

  /**
   * Clears edit state for current message (passed down from message component)
   */
  clearEditingState: PropTypes.func
};
EditMessageForm.defaultProps = {
  focus: false,
  disabled: false,
  publishTypingEvent: true,
  grow: true,
  maxRows: 10,
  additionalTextareaProps: {}
};

/** @type {React.ForwardRefRenderFunction<HTMLDivElement | null, import("types").ReactionSelectorProps>} */

var ReactionSelectorWithRef = function ReactionSelectorWithRef(_ref, ref) {
  var _getUsersPerReactionT;

  var _ref$Avatar = _ref.Avatar,
      Avatar$1 = _ref$Avatar === void 0 ? Avatar : _ref$Avatar,
      latest_reactions = _ref.latest_reactions,
      reaction_counts = _ref.reaction_counts,
      reactionOptionsProp = _ref.reactionOptions,
      _ref$reverse = _ref.reverse,
      reverse = _ref$reverse === void 0 ? false : _ref$reverse,
      handleReaction = _ref.handleReaction,
      _ref$detailedView = _ref.detailedView,
      detailedView = _ref$detailedView === void 0 ? true : _ref$detailedView;

  var _useContext = useContext(ChannelContext),
      emojiConfig = _useContext.emojiConfig;

  var _ref2 = emojiConfig || {},
      defaultMinimalEmojis = _ref2.defaultMinimalEmojis,
      Emoji = _ref2.Emoji,
      fullEmojiData = _ref2.emojiData,
      emojiSetDef = _ref2.emojiSetDef;

  var emojiData = getStrippedEmojiData(fullEmojiData);
  var reactionOptions = reactionOptionsProp || defaultMinimalEmojis;

  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      tooltipReactionType = _useState2[0],
      setTooltipReactionType = _useState2[1];

  var _useState3 = useState(
  /** @type {{ tooltip: number, arrow: number } | null} */
  null),
      _useState4 = _slicedToArray(_useState3, 2),
      tooltipPositions = _useState4[0],
      setTooltipPositions = _useState4[1];

  var containerRef = useRef(
  /** @type {HTMLDivElement | null} */
  null);
  var tooltipRef = useRef(
  /** @type {HTMLDivElement | null} */
  null);
  var targetRef = useRef(
  /** @type {HTMLDivElement | null} */
  null); // @ts-expect-error because it's okay for our ref to be null in the parent component.

  useImperativeHandle(ref, function () {
    return containerRef.current;
  });
  var showTooltip = useCallback(function (e, reactionType) {
    targetRef.current = e.target;
    setTooltipReactionType(reactionType);
  }, []);
  var hideTooltip = useCallback(function () {
    setTooltipReactionType(null);
    setTooltipPositions(null);
  }, []);
  useEffect(function () {
    if (tooltipReactionType) {
      var _tooltipRef$current, _targetRef$current, _containerRef$current;

      var tooltip = (_tooltipRef$current = tooltipRef.current) === null || _tooltipRef$current === void 0 ? void 0 : _tooltipRef$current.getBoundingClientRect();
      var target = (_targetRef$current = targetRef.current) === null || _targetRef$current === void 0 ? void 0 : _targetRef$current.getBoundingClientRect();
      var container = (_containerRef$current = containerRef.current) === null || _containerRef$current === void 0 ? void 0 : _containerRef$current.getBoundingClientRect();
      if (!tooltip || !target || !container) return;
      var tooltipPosition = tooltip.width === container.width || tooltip.x < container.x ? 0 : target.left + target.width / 2 - container.left - tooltip.width / 2;
      var arrowPosition = target.x - tooltip.x + target.width / 2 - tooltipPosition;
      setTooltipPositions({
        tooltip: tooltipPosition,
        arrow: arrowPosition
      });
    }
  }, [tooltipReactionType, containerRef]);
  /**
   * @param {string | null} type
   * @returns {string[] | undefined}
   * */

  var getUsersPerReactionType = function getUsersPerReactionType(type) {
    return (
      /** @type {string[] | undefined} */
      latest_reactions === null || latest_reactions === void 0 ? void 0 : latest_reactions.map(function (reaction) {
        if (reaction.type === type) {
          var _reaction$user, _reaction$user2;

          return ((_reaction$user = reaction.user) === null || _reaction$user === void 0 ? void 0 : _reaction$user.name) || ((_reaction$user2 = reaction.user) === null || _reaction$user2 === void 0 ? void 0 : _reaction$user2.id);
        }

        return null;
      }).filter(Boolean)
    );
  };
  /**
   * @param {string | null} type
   * @returns {import("types").StreamChatReactClient['user'] | undefined}
   * */


  var getLatestUserForReactionType = function getLatestUserForReactionType(type) {
    var _latest_reactions$fin;

    return (latest_reactions === null || latest_reactions === void 0 ? void 0 : (_latest_reactions$fin = latest_reactions.find(function (reaction) {
      return reaction.type === type && !!reaction.user;
    })) === null || _latest_reactions$fin === void 0 ? void 0 : _latest_reactions$fin.user) || undefined;
  };

  return /*#__PURE__*/React.createElement("div", {
    "data-testid": "reaction-selector",
    className: "str-chat__reaction-selector ".concat(reverse ? 'str-chat__reaction-selector--reverse' : ''),
    ref: containerRef
  }, !!tooltipReactionType && detailedView && /*#__PURE__*/React.createElement("div", {
    className: "str-chat__reaction-selector-tooltip",
    ref: tooltipRef,
    style: {
      left: tooltipPositions === null || tooltipPositions === void 0 ? void 0 : tooltipPositions.tooltip,
      visibility: tooltipPositions ? 'visible' : 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "arrow",
    style: {
      left: tooltipPositions === null || tooltipPositions === void 0 ? void 0 : tooltipPositions.arrow
    }
  }), (_getUsersPerReactionT = getUsersPerReactionType(tooltipReactionType)) === null || _getUsersPerReactionT === void 0 ? void 0 : _getUsersPerReactionT.map(function (user, i, users) {
    return /*#__PURE__*/React.createElement("span", {
      className: "latest-user-username",
      key: "key-".concat(i, "-").concat(user)
    }, "".concat(user).concat(i < users.length - 1 ? ', ' : ''));
  })), /*#__PURE__*/React.createElement("ul", {
    className: "str-chat__message-reactions-list"
  }, reactionOptions.map(function (reactionOption) {
    var latestUser = getLatestUserForReactionType(reactionOption.id);
    var count = reaction_counts && reaction_counts[reactionOption.id];
    return /*#__PURE__*/React.createElement("li", {
      key: "item-".concat(reactionOption.id),
      className: "str-chat__message-reactions-list-item",
      "data-text": reactionOption.id,
      onClick: function onClick() {
        return handleReaction && handleReaction(reactionOption.id);
      }
    }, !!count && detailedView && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "latest-user",
      onClick: hideTooltip,
      onMouseEnter: function onMouseEnter(e) {
        return showTooltip(e, reactionOption.id);
      },
      onMouseLeave: hideTooltip
    }, latestUser ? /*#__PURE__*/React.createElement(Avatar$1, {
      image: latestUser.image,
      size: 20,
      name: latestUser.name
    }) : /*#__PURE__*/React.createElement("div", {
      className: "latest-user-not-found"
    }))), Emoji && /*#__PURE__*/React.createElement(Emoji // @ts-expect-error because emoji-mart types don't support specifying
    // spriteUrl instead of imageUrl, while the implementation does
    , _extends({
      emoji: reactionOption
    }, emojiSetDef, {
      data: emojiData
    })), Boolean(count) && detailedView && /*#__PURE__*/React.createElement("span", {
      className: "str-chat__message-reactions-list-item__count"
    }, count || ''));
  })));
};

var ReactionSelector = /*#__PURE__*/React.forwardRef(ReactionSelectorWithRef);
ReactionSelector.propTypes = {
  /**
   * Custom UI component to display user avatar
   *
   * Defaults to and accepts same props as: [Avatar](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Avatar/Avatar.js)
   * */
  Avatar:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').AvatarProps>>} */
  PropTypes.elementType,

  /**
   * Array of latest reactions.
   * Reaction object has following structure:
   *
   * ```json
   * {
   *  "type": "love",
   *  "user_id": "demo_user_id",
   *  "user": {
   *    ...userObject
   *  },
   *  "created_at": "datetime";
   * }
   * ```
   * */
  latest_reactions: PropTypes.array,

  /** Object/map of reaction id/type (e.g. 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry') vs count */
  reaction_counts: PropTypes.objectOf(PropTypes.number.isRequired),

  /** Provide a list of reaction options [{id: 'angry', emoji: 'angry'}] */
  reactionOptions: PropTypes.array,
  reverse: PropTypes.bool,

  /**
   * Handler to set/unset reaction on message.
   *
   * @param type e.g. 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry'
   * */
  handleReaction: PropTypes.func.isRequired,

  /** Enable the avatar display */
  detailedView: PropTypes.bool
};
var DefaultReactionSelector = /*#__PURE__*/React.memo(ReactionSelector);

/** @type {React.FC<import("types").ReactionsListProps>} */

var ReactionsList = function ReactionsList(_ref) {
  var reactions = _ref.reactions,
      reaction_counts = _ref.reaction_counts,
      reactionOptionsProp = _ref.reactionOptions,
      _ref$reverse = _ref.reverse,
      reverse = _ref$reverse === void 0 ? false : _ref$reverse,
      onClick = _ref.onClick;

  var _useContext = useContext(ChannelContext),
      emojiConfig = _useContext.emojiConfig;

  var _ref2 = emojiConfig || {},
      defaultMinimalEmojis = _ref2.defaultMinimalEmojis,
      Emoji = _ref2.Emoji,
      fullEmojiData = _ref2.emojiData,
      emojiSetDef = _ref2.emojiSetDef;

  var emojiData = useMemo(function () {
    return getStrippedEmojiData(fullEmojiData);
  }, [fullEmojiData]);
  var reactionOptions = reactionOptionsProp || defaultMinimalEmojis;

  var getTotalReactionCount = function getTotalReactionCount() {
    return Object.values(reaction_counts || {}).reduce(function (total, count) {
      return total + count;
    }, 0);
  };
  /** @param {string} type */


  var getOptionForType = function getOptionForType(type) {
    return reactionOptions.find(function (option) {
      return option.id === type;
    });
  };

  var getReactionTypes = function getReactionTypes() {
    if (!reactions) return [];
    var allTypes = new Set();
    reactions.forEach(function (_ref3) {
      var type = _ref3.type;
      allTypes.add(type);
    });
    return Array.from(allTypes);
  };

  return /*#__PURE__*/React.createElement("div", {
    "data-testid": "reaction-list",
    className: "str-chat__reaction-list ".concat(reverse ? 'str-chat__reaction-list--reverse' : ''),
    onClick: onClick
  }, /*#__PURE__*/React.createElement("ul", null, getReactionTypes().map(function (reactionType) {
    var emojiDefinition = getOptionForType(reactionType);
    return emojiDefinition ? /*#__PURE__*/React.createElement("li", {
      key: emojiDefinition.id
    }, Emoji && /*#__PURE__*/React.createElement(Emoji // emoji-mart type defs don't support spriteSheet use case
    // (but implementation does)
    // @ts-expect-error
    , _extends({
      emoji: emojiDefinition
    }, emojiSetDef, {
      size: 16,
      data: emojiData
    })), "\xA0") : null;
  }), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "str-chat__reaction-list--counter"
  }, getTotalReactionCount()))));
};

ReactionsList.propTypes = {
  reactions: PropTypes.array,

  /** Object/map of reaction id/type (e.g. 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry') vs count */
  reaction_counts: PropTypes.objectOf(PropTypes.number.isRequired),

  /** Provide a list of reaction options [{id: 'angry', emoji: 'angry'}] */
  reactionOptions: PropTypes.array,
  reverse: PropTypes.bool,
  onClick: PropTypes.func
};
var DefaultReactionsList = /*#__PURE__*/React.memo(ReactionsList);

/** @type {React.FC<import("types").SimpleReactionsListProps>} */

var SimpleReactionsList = function SimpleReactionsList(_ref) {
  var reactions = _ref.reactions,
      reaction_counts = _ref.reaction_counts,
      reactionOptionsProp = _ref.reactionOptions,
      handleReaction = _ref.handleReaction;

  var _useContext = useContext(ChannelContext),
      emojiConfig = _useContext.emojiConfig;

  var _ref2 = emojiConfig || {},
      defaultMinimalEmojis = _ref2.defaultMinimalEmojis,
      Emoji = _ref2.Emoji,
      defaultEmojiData = _ref2.emojiData,
      emojiSetDef = _ref2.emojiSetDef;

  var emojiData = getStrippedEmojiData(defaultEmojiData);

  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      tooltipReactionType = _useState2[0],
      setTooltipReactionType = _useState2[1];
  /** @type{import('../types').MinimalEmojiInterface[]} */


  var reactionOptions = reactionOptionsProp || defaultMinimalEmojis;

  if (!reactions || reactions.length === 0) {
    return null;
  }
  /** @param {string | null} type */


  var getUsersPerReactionType = function getUsersPerReactionType(type) {
    return reactions === null || reactions === void 0 ? void 0 : reactions.map(function (reaction) {
      if (reaction.type === type) {
        var _reaction$user, _reaction$user2;

        return ((_reaction$user = reaction.user) === null || _reaction$user === void 0 ? void 0 : _reaction$user.name) || ((_reaction$user2 = reaction.user) === null || _reaction$user2 === void 0 ? void 0 : _reaction$user2.id);
      }

      return null;
    }).filter(Boolean);
  };

  var getTotalReactionCount = function getTotalReactionCount() {
    return Object.values(reaction_counts || {}).reduce(function (total, count) {
      return total + count;
    }, 0);
  };

  var getReactionTypes = function getReactionTypes() {
    if (!reactions) return [];
    var allTypes = new Set();
    reactions.forEach(function (_ref3) {
      var type = _ref3.type;
      allTypes.add(type);
    });
    return Array.from(allTypes);
  };
  /** @param {string} type */


  var getOptionForType = function getOptionForType(type) {
    return reactionOptions.find(function (option) {
      return option.id === type;
    });
  };

  return /*#__PURE__*/React.createElement("ul", {
    "data-testid": "simple-reaction-list",
    className: "str-chat__simple-reactions-list",
    onMouseLeave: function onMouseLeave() {
      return setTooltipReactionType(null);
    }
  }, getReactionTypes().map(function (reactionType, i) {
    var _getOptionForType, _getUsersPerReactionT;

    var emojiDefinition = getOptionForType(reactionType);
    return emojiDefinition ? /*#__PURE__*/React.createElement("li", {
      className: "str-chat__simple-reactions-list-item",
      key: "".concat(emojiDefinition === null || emojiDefinition === void 0 ? void 0 : emojiDefinition.id, "-").concat(i),
      onClick: function onClick() {
        return handleReaction && handleReaction(reactionType);
      }
    }, /*#__PURE__*/React.createElement("span", {
      onMouseEnter: function onMouseEnter() {
        return setTooltipReactionType(reactionType);
      }
    }, Emoji && /*#__PURE__*/React.createElement(Emoji // emoji-mart type defs don't support spriteSheet use case
    // (but implementation does)
    // @ts-expect-error
    , _extends({
      emoji: emojiDefinition
    }, emojiSetDef, {
      size: 13,
      data: emojiData
    })), "\xA0"), tooltipReactionType === ((_getOptionForType = getOptionForType(reactionType)) === null || _getOptionForType === void 0 ? void 0 : _getOptionForType.id) && /*#__PURE__*/React.createElement("div", {
      className: "str-chat__simple-reactions-list-tooltip"
    }, /*#__PURE__*/React.createElement("div", {
      className: "arrow"
    }), (_getUsersPerReactionT = getUsersPerReactionType(tooltipReactionType)) === null || _getUsersPerReactionT === void 0 ? void 0 : _getUsersPerReactionT.join(', '))) : null;
  }), (reactions === null || reactions === void 0 ? void 0 : reactions.length) !== 0 && /*#__PURE__*/React.createElement("li", {
    className: "str-chat__simple-reactions-list-item--last-number"
  }, getTotalReactionCount()));
};

SimpleReactionsList.propTypes = {
  reactions: PropTypes.array,

  /** Object/map of reaction id/type (e.g. 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry') vs count */
  reaction_counts: PropTypes.objectOf(PropTypes.number.isRequired),

  /** Provide a list of reaction options [{id: 'angry', emoji: 'angry'}] */
  reactionOptions: PropTypes.array,

  /**
   * Handler to set/unset reaction on message.
   *
   * @param type e.g. 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry'
   * */
  handleReaction: PropTypes.func
};
var DefaultReactionsList$1 = /*#__PURE__*/React.memo(SimpleReactionsList);

function ownKeys$5(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$5(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$5(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$5(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var handleActionWarning = "Action handler was called, but it is missing one of its required arguments.\n      Make sure the ChannelContext was properly set and that this hook was initialized with a valid message.";
/**
 * @type {import('../types').useActionHandler}
 */

var useActionHandler = function useActionHandler(message) {
  var _useContext = useContext(ChannelContext),
      channel = _useContext.channel,
      updateMessage = _useContext.updateMessage,
      removeMessage = _useContext.removeMessage;

  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(dataOrName, value, event) {
      var messageID, formData, data;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (event) event.preventDefault();

              if (!(!message || !updateMessage || !removeMessage || !channel)) {
                _context.next = 4;
                break;
              }

              console.warn(handleActionWarning);
              return _context.abrupt("return");

            case 4:
              messageID = message.id; // deprecated: value&name should be removed in favor of data obj

              /** @type {Record<string, any>} */

              formData = {};
              if (typeof dataOrName === 'string') formData[dataOrName] = value;else formData = _objectSpread$5({}, dataOrName);

              if (!messageID) {
                _context.next = 12;
                break;
              }

              _context.next = 10;
              return channel.sendAction(messageID, formData);

            case 10:
              data = _context.sent;

              if (data !== null && data !== void 0 && data.message) {
                updateMessage(data.message);
              } else {
                removeMessage(message);
              }

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();
};

/** @type {(width: number) => {device: 'mobile' | 'tablet' | 'full'; width: number}} */

var getDeviceWidth = function getDeviceWidth(width) {
  if (width < 768) return {
    device: 'mobile',
    width
  };
  if (width < 1024) return {
    device: 'tablet',
    width
  };
  return {
    device: 'full',
    width
  };
};

var useBreakpoint = function useBreakpoint() {
  var _useState = useState(getDeviceWidth(window.innerWidth)),
      _useState2 = _slicedToArray(_useState, 2),
      breakpoint = _useState2[0],
      setBreakpoint = _useState2[1];

  useEffect(function () {
    var getInnerWidth = throttle(function () {
      return setBreakpoint(getDeviceWidth(window.innerWidth));
    }, 200);
    window.addEventListener('resize', getInnerWidth);
    return function () {
      return window.removeEventListener('resize', getInnerWidth);
    };
  }, []);
  return breakpoint;
};

/**
 * @type {import('../types').useDeleteHandler}
 */

var useDeleteHandler = function useDeleteHandler(message) {
  var _useContext = useContext(ChannelContext),
      updateMessage = _useContext.updateMessage,
      client = _useContext.client;

  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(event) {
      var data;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              event.preventDefault();

              if (!(!(message !== null && message !== void 0 && message.id) || !client || !updateMessage)) {
                _context.next = 3;
                break;
              }

              return _context.abrupt("return");

            case 3:
              _context.next = 5;
              return client.deleteMessage(message.id);

            case 5:
              data = _context.sent;
              updateMessage(data.message);

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();
};

/**
 * @type {(
 *   customInitialState?: boolean,
 *   customSetEditing?: (event?: React.MouseEvent<HTMLElement>) => void,
 *   customClearEditingHandler?: (event?: React.MouseEvent<HTMLElement>) => void
 * ) => {
 *   editing: boolean,
 *   setEdit: (event?: React.MouseEvent<HTMLElement>) => void,
 *   clearEdit: (event?: React.MouseEvent<HTMLElement>) => void
 * }}
 */

var useEditHandler = function useEditHandler() {
  var customInitialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var customSetEditing = arguments.length > 1 ? arguments[1] : undefined;
  var customClearEditingHandler = arguments.length > 2 ? arguments[2] : undefined;

  var _useState = useState(customInitialState),
      _useState2 = _slicedToArray(_useState, 2),
      editing = _useState2[0],
      setEditing = _useState2[1];

  var setEdit = customSetEditing || function (event) {
    if (event !== null && event !== void 0 && event.preventDefault) {
      event.preventDefault();
    }

    setEditing(true);
  };

  var clearEdit = customClearEditingHandler || function (event) {
    if (event !== null && event !== void 0 && event.preventDefault) {
      event.preventDefault();
    }

    setEditing(false);
  };

  return {
    editing,
    setEdit,
    clearEdit
  };
};

/**
 * Following function validates a function which returns notification message.
 * It validates if the first parameter is function and also if return value of function is string or no.
 *
 * @type {(func: Function, args: any) => null | string}
 */

var validateAndGetMessage = function validateAndGetMessage(func, args) {
  if (!func || typeof func !== 'function') return null;
  var returnValue = func.apply(void 0, _toConsumableArray(args));
  if (typeof returnValue !== 'string') return null;
  return returnValue;
};
/**
 * Tell if the owner of the current message is muted
 *
 * @type {(message?: import('stream-chat').MessageResponse, mutes?: import('stream-chat').Mute[]) => boolean}
 */

var isUserMuted = function isUserMuted(message, mutes) {
  if (!mutes || !message) {
    return false;
  }

  var userMuted = mutes.filter(
  /** @type {(el: import('stream-chat').Mute) => boolean} Typescript syntax */
  function (el) {
    var _message$user;

    return el.target.id === ((_message$user = message.user) === null || _message$user === void 0 ? void 0 : _message$user.id);
  });
  return !!userMuted.length;
};
var MESSAGE_ACTIONS = {
  edit: 'edit',
  delete: 'delete',
  flag: 'flag',
  mute: 'mute',
  pin: 'pin',
  react: 'react',
  reply: 'reply'
};
var defaultPinPermissions = {
  commerce: {
    admin: true,
    anonymous: false,
    channel_member: false,
    channel_moderator: true,
    guest: false,
    member: false,
    moderator: true,
    owner: false,
    user: false
  },
  gaming: {
    admin: true,
    anonymous: false,
    channel_member: false,
    channel_moderator: true,
    guest: false,
    member: false,
    moderator: true,
    owner: false,
    user: false
  },
  livestream: {
    admin: true,
    anonymous: false,
    channel_member: false,
    channel_moderator: true,
    guest: false,
    member: false,
    moderator: true,
    owner: true,
    user: false
  },
  messaging: {
    admin: true,
    anonymous: false,
    channel_member: true,
    channel_moderator: true,
    guest: false,
    member: true,
    moderator: true,
    owner: true,
    user: false
  },
  team: {
    admin: true,
    anonymous: false,
    channel_member: true,
    channel_moderator: true,
    guest: false,
    member: true,
    moderator: true,
    owner: true,
    user: false
  }
};
/**
 * @typedef {{
 *   canEdit?: boolean;
 *   canDelete?: boolean;
 *   canMute?: boolean;
 *   canFlag?: boolean;
 *   canPin?: boolean;
 *   canReact?: boolean;
 *   canReply?: boolean;
 * }} Capabilities
 * @type {(actions: string[] | boolean, capabilities: Capabilities) => string[]} Typescript syntax
 */

var getMessageActions = function getMessageActions(actions, _ref) {
  var canDelete = _ref.canDelete,
      canFlag = _ref.canFlag,
      canEdit = _ref.canEdit,
      canMute = _ref.canMute,
      canPin = _ref.canPin,
      canReact = _ref.canReact,
      canReply = _ref.canReply;
  var messageActionsAfterPermission = [];
  var messageActions = [];

  if (actions && typeof actions === 'boolean') {
    // If value of actions is true, then populate all the possible values
    messageActions = Object.keys(MESSAGE_ACTIONS);
  } else if (actions && actions.length > 0) {
    messageActions = _toConsumableArray(actions);
  } else {
    return [];
  }

  if (canEdit && messageActions.indexOf(MESSAGE_ACTIONS.edit) > -1) {
    messageActionsAfterPermission.push(MESSAGE_ACTIONS.edit);
  }

  if (canDelete && messageActions.indexOf(MESSAGE_ACTIONS.delete) > -1) {
    messageActionsAfterPermission.push(MESSAGE_ACTIONS.delete);
  }

  if (canFlag && messageActions.indexOf(MESSAGE_ACTIONS.flag) > -1) {
    messageActionsAfterPermission.push(MESSAGE_ACTIONS.flag);
  }

  if (canMute && messageActions.indexOf(MESSAGE_ACTIONS.mute) > -1) {
    messageActionsAfterPermission.push(MESSAGE_ACTIONS.mute);
  }

  if (canPin && messageActions.indexOf(MESSAGE_ACTIONS.pin) > -1) {
    messageActionsAfterPermission.push(MESSAGE_ACTIONS.pin);
  }

  if (canReact && messageActions.indexOf(MESSAGE_ACTIONS.react) > -1) {
    messageActionsAfterPermission.push(MESSAGE_ACTIONS.react);
  }

  if (canReply && messageActions.indexOf(MESSAGE_ACTIONS.reply) > -1) {
    messageActionsAfterPermission.push(MESSAGE_ACTIONS.reply);
  }

  return messageActionsAfterPermission;
};
/**
 * @typedef {Pick<import('../types').MessageComponentProps, 'message' | 'readBy' | 'groupStyles' | 'lastReceivedId' | 'messageListRect'>} MessageEqualProps
 * @type {(props: MessageEqualProps, nextProps: MessageEqualProps) => boolean} Typescript syntax
 */

var areMessagePropsEqual = function areMessagePropsEqual(props, nextProps) {
  return (// Message content is equal
    nextProps.message === props.message && // Message was read by someone
    deepequal(nextProps.readBy, props.readBy) && // Group style changes (it often happens that the last 3 messages of a channel have different group styles)
    deepequal(nextProps.groupStyles, props.groupStyles) && // @ts-expect-error
    deepequal(nextProps.mutes, props.mutes) && // Last message received in the channel changes
    deepequal(nextProps.lastReceivedId, props.lastReceivedId) && // User toggles edit state
    // @ts-expect-error // TODO: fix
    nextProps.editing === props.editing && // Message wrapper layout changes
    nextProps.messageListRect === props.messageListRect
  );
};
/**
 * @type {(nextProps: import('../types').MessageComponentProps, props: import('../types').MessageComponentProps ) => boolean} Typescript syntax
 */

var shouldMessageComponentUpdate = function shouldMessageComponentUpdate(props, nextProps) {
  // Component should only update if:
  return !areMessagePropsEqual(props, nextProps);
};
/** @type {(message: import('stream-chat').MessageResponse | undefined) => boolean} */

var messageHasReactions = function messageHasReactions(message) {
  return !!(message !== null && message !== void 0 && message.latest_reactions) && !!message.latest_reactions.length;
};
/** @type {(message: import('stream-chat').MessageResponse | undefined) => boolean} */

var messageHasAttachments = function messageHasAttachments(message) {
  return !!(message !== null && message !== void 0 && message.attachments) && !!message.attachments.length;
};
/**
 * @type {(message: import('stream-chat').MessageResponse | undefined) => import('stream-chat').Attachment[] }
 */

var getImages = function getImages(message) {
  if (!(message !== null && message !== void 0 && message.attachments)) {
    return [];
  }

  return message.attachments.filter(
  /** @type {(item: import('stream-chat').Attachment) => boolean} Typescript syntax */
  function (item) {
    return item.type === 'image';
  });
};
/**
 * @type {(message: import('stream-chat').MessageResponse | undefined) => import('stream-chat').Attachment[] }
 */

var getNonImageAttachments = function getNonImageAttachments(message) {
  if (!(message !== null && message !== void 0 && message.attachments)) {
    return [];
  }

  return message.attachments.filter(
  /** @type {(item: import('stream-chat').Attachment) => boolean} Typescript syntax */
  function (item) {
    return item.type !== 'image';
  });
};
/**
 * @typedef {Array<import('stream-chat').UserResponse<import('../types').StreamChatReactUserType>>} ReadByUsers
 * @type {(
 *   users: ReadByUsers,
 *   t: import('../types').TranslationContextValue['t'],
 *   client: import('../types').ChannelContextValue['client']
 * ) => string}
 */

var getReadByTooltipText = function getReadByTooltipText(users, t, client) {
  var outStr = '';

  if (!t) {
    throw new Error('`getReadByTooltipText was called, but translation function is not available`');
  } // first filter out client user, so restLength won't count it


  var otherUsers = users.filter(function (item) {
    return item && (client === null || client === void 0 ? void 0 : client.user) && item.id !== client.user.id;
  }).map(function (item) {
    return item.name || item.id;
  });
  var slicedArr = otherUsers.slice(0, 5);
  var restLength = otherUsers.length - slicedArr.length;

  if (slicedArr.length === 1) {
    outStr = "".concat(slicedArr[0], " ");
  } else if (slicedArr.length === 2) {
    // joins all with "and" but =no commas
    // example: "bob and sam"
    outStr = t('{{ firstUser }} and {{ secondUser }}', {
      firstUser: slicedArr[0],
      secondUser: slicedArr[1]
    });
  } else if (slicedArr.length > 2) {
    // joins all with commas, but last one gets ", and" (oxford comma!)
    // example: "bob, joe, sam and 4 more"
    if (restLength === 0) {
      // mutate slicedArr to remove last user to display it separately
      var lastUser = slicedArr.splice(slicedArr.length - 2, 1);
      outStr = t('{{ commaSeparatedUsers }}, and {{ lastUser }}', {
        commaSeparatedUsers: slicedArr.join(', '),
        lastUser
      });
    } else {
      outStr = t('{{ commaSeparatedUsers }} and {{ moreCount }} more', {
        commaSeparatedUsers: slicedArr.join(', '),
        moreCount: restLength
      });
    }
  }

  return outStr;
};
var MessagePropTypes = PropTypes.shape({
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  html: PropTypes.string.isRequired,
  created_at: PropTypes.instanceOf(Date).isRequired,
  updated_at: PropTypes.instanceOf(Date).isRequired
}).isRequired;

var missingUseFlagHandlerParameterWarning = 'useFlagHandler was called but it is missing one or more necessary parameters.';
/**
 * @type {import('../types').useFlagHandler}
 */

var useFlagHandler = function useFlagHandler(message) {
  var notifications = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _useContext = useContext(ChannelContext),
      client = _useContext.client;

  var _useContext2 = useContext(TranslationContext),
      t = _useContext2.t;
  /** @type {(event: React.MouseEvent<HTMLElement>) => Promise<void>} Typescript syntax */


  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(event) {
      var notify, getSuccessNotification, getErrorNotification, successMessage, errorMessage;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              event.preventDefault();
              notify = notifications.notify, getSuccessNotification = notifications.getSuccessNotification, getErrorNotification = notifications.getErrorNotification;

              if (!(!client || !t || !notify || !(message !== null && message !== void 0 && message.id))) {
                _context.next = 5;
                break;
              }

              console.warn(missingUseFlagHandlerParameterWarning);
              return _context.abrupt("return");

            case 5:
              _context.prev = 5;
              _context.next = 8;
              return client.flagMessage(message.id);

            case 8:
              successMessage = getSuccessNotification && validateAndGetMessage(getSuccessNotification, [message]);
              notify(successMessage || t('Message has been successfully flagged'), 'success');
              _context.next = 16;
              break;

            case 12:
              _context.prev = 12;
              _context.t0 = _context["catch"](5);
              errorMessage = getErrorNotification && validateAndGetMessage(getErrorNotification, [message]);
              notify(errorMessage || t('Error adding flag: Either the flag already exist or there is issue with network connection ...'), 'error');

            case 16:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[5, 12]]);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();
};

// @ts-check
/** @type {(fn: Function | undefined, message: import('stream-chat').MessageResponse | undefined) => React.EventHandler<React.SyntheticEvent>} * */

function createEventHandler(fn, message) {
  return function (e) {
    if (typeof fn !== 'function' || !(message !== null && message !== void 0 && message.mentioned_users)) {
      return;
    }

    fn(e, message.mentioned_users);
  };
}
/**
 * @type {import('../types').useMentionsHandler}
 */


var useMentionsHandler = function useMentionsHandler(message, customMentionHandler) {
  /**
   * @type{import('../types').ChannelContextValue}
   */
  var _useContext = useContext(ChannelContext),
      channelOnMentionsClick = _useContext.onMentionsClick,
      channelOnMentionsHover = _useContext.onMentionsHover;

  var onMentionsClick = (customMentionHandler === null || customMentionHandler === void 0 ? void 0 : customMentionHandler.onMentionsClick) || channelOnMentionsClick || function () {};

  var onMentionsHover = (customMentionHandler === null || customMentionHandler === void 0 ? void 0 : customMentionHandler.onMentionsHover) || channelOnMentionsHover || function () {};

  return {
    /** @type {(e: React.MouseEvent<HTMLElement>) => void} Typescript syntax */
    onMentionsClick: createEventHandler(onMentionsClick, message),

    /** @type {(e: React.MouseEvent<HTMLElement>) => void} Typescript syntax */
    onMentionsHover: createEventHandler(onMentionsHover, message)
  };
};
/**
 * @type {import('../types').useMentionsUIHandler}
 */

var useMentionsUIHandler = function useMentionsUIHandler(message, eventHandlers) {
  /**
   * @type{import('../types').ChannelContextValue}
   */
  var _useContext2 = useContext(ChannelContext),
      onMentionsClick = _useContext2.onMentionsClick,
      onMentionsHover = _useContext2.onMentionsHover;

  return {
    /** @type {(e: React.MouseEvent<HTMLElement>) => void} Typescript syntax */
    onMentionsClick: (eventHandlers === null || eventHandlers === void 0 ? void 0 : eventHandlers.onMentionsClick) || createEventHandler(onMentionsClick, message),

    /** @type {(e: React.MouseEvent<HTMLElement>) => void} Typescript syntax */
    onMentionsHover: (eventHandlers === null || eventHandlers === void 0 ? void 0 : eventHandlers.onMentionsHover) || createEventHandler(onMentionsHover, message)
  };
};

var useMobilePress = function useMobilePress() {
  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      targetMessage = _useState2[0],
      setTargetMessage = _useState2[1];

  var breakpoint = useBreakpoint();
  /** @type {(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void} */

  var handleMobilePress = function handleMobilePress(event) {
    if (event.target instanceof HTMLElement && breakpoint.device === 'mobile') {
      var closestMessage = event.target.closest('.str-chat__message-simple');
      if (!closestMessage) return;
      setTargetMessage(closestMessage);

      if (closestMessage.classList.contains('mobile-press')) {
        closestMessage.classList.remove('mobile-press');
      } else {
        closestMessage.classList.add('mobile-press');
      }
    }
  };

  useEffect(function () {
    var handleClick = function handleClick(event) {
      var isClickInside = targetMessage === null || targetMessage === void 0 ? void 0 : targetMessage.contains(event.target);

      if (!isClickInside && targetMessage) {
        targetMessage.classList.remove('mobile-press');
      }
    };

    if (breakpoint.device === 'mobile') {
      document.addEventListener('click', handleClick);
    }

    return function () {
      return document.removeEventListener('click', handleClick);
    };
  }, [breakpoint, targetMessage]);
  return {
    handleMobilePress
  };
};

var missingUseMuteHandlerParamsWarning = 'useMuteHandler was called but it is missing one or more necessary parameter.';
/**
 * @type {import('../types').useMuteHandler}
 */

var useMuteHandler = function useMuteHandler(message) {
  var notifications = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _useContext = useContext(ChannelContext),
      client = _useContext.client,
      mutes = _useContext.mutes;

  var _useContext2 = useContext(TranslationContext),
      t = _useContext2.t;
  /** @type {(event: React.MouseEvent<HTMLElement>) => Promise<void>} Typescript syntax */


  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(event) {
      var notify, getSuccessNotification, getErrorNotification, successMessage, errorMessage, fallbackMessage, _successMessage, _errorMessage;

      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              event.preventDefault();
              notify = notifications.notify, getSuccessNotification = notifications.getSuccessNotification, getErrorNotification = notifications.getErrorNotification;

              if (!(!t || !(message !== null && message !== void 0 && message.user) || !notify || !client)) {
                _context.next = 5;
                break;
              }

              console.warn(missingUseMuteHandlerParamsWarning);
              return _context.abrupt("return");

            case 5:
              if (isUserMuted(message, mutes)) {
                _context.next = 19;
                break;
              }

              _context.prev = 6;
              _context.next = 9;
              return client.muteUser(message.user.id);

            case 9:
              successMessage = getSuccessNotification && validateAndGetMessage(getSuccessNotification, [message.user]);
              notify(successMessage || t("{{ user }} has been muted", {
                user: message.user.name || message.user.id
              }), 'success');
              _context.next = 17;
              break;

            case 13:
              _context.prev = 13;
              _context.t0 = _context["catch"](6);
              errorMessage = getErrorNotification && validateAndGetMessage(getErrorNotification, [message.user]);
              notify(errorMessage || t('Error muting a user ...'), 'error');

            case 17:
              _context.next = 31;
              break;

            case 19:
              _context.prev = 19;
              _context.next = 22;
              return client.unmuteUser(message.user.id);

            case 22:
              fallbackMessage = t("{{ user }} has been unmuted", {
                user: message.user.name || message.user.id
              });
              _successMessage = getSuccessNotification && validateAndGetMessage(getSuccessNotification, [message.user]) || fallbackMessage;

              if (typeof _successMessage === 'string') {
                notify(_successMessage, 'success');
              }

              _context.next = 31;
              break;

            case 27:
              _context.prev = 27;
              _context.t1 = _context["catch"](19);
              _errorMessage = getErrorNotification && validateAndGetMessage(getErrorNotification, [message.user]) || t('Error unmuting a user ...');

              if (typeof _errorMessage === 'string') {
                notify(_errorMessage, 'error');
              }

            case 31:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[6, 13], [19, 27]]);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();
};

// @ts-check
/**
 * @type {import('../types').useOpenThreadHandler}
 */

var useOpenThreadHandler = function useOpenThreadHandler(message, customOpenThread) {
  /**
   * @type{import('../types').ChannelContextValue}
   */
  var _useContext = useContext(ChannelContext),
      channelOpenThread = _useContext.openThread;

  var openThread = customOpenThread || channelOpenThread;
  return function (event) {
    if (!openThread || !message) {
      console.warn('Open thread handler was called but it is missing one of its parameters');
      return;
    }

    openThread(message, event);
  };
};

/**
 * @type {import('../types').usePinHandler}
 */

var usePinHandler = function usePinHandler(message, permissions, notifications) {
  var notify = notifications.notify,
      getErrorNotification = notifications.getErrorNotification;

  var _useContext = useContext(ChannelContext),
      client = _useContext.client,
      channel = _useContext.channel;

  var _useContext2 = useContext(TranslationContext),
      t = _useContext2.t;

  var canPin = function canPin() {
    var _client$user;

    if (!client || !(channel !== null && channel !== void 0 && channel.state) || !permissions || !permissions[channel.type]) {
      return false;
    }

    var currentChannelPermissions = permissions[channel.type];
    var currentChannelMember = channel.state.members[client.userID];
    var currentChannelWatcher = channel.state.watchers[client.userID];

    if (currentChannelPermissions && currentChannelPermissions[(_client$user = client.user) === null || _client$user === void 0 ? void 0 : _client$user.role]) {
      return true;
    }

    if (currentChannelMember && currentChannelPermissions[currentChannelMember.role]) {
      return true;
    }

    if (currentChannelWatcher && currentChannelPermissions[currentChannelWatcher.role]) {
      return true;
    }

    return false;
  };

  var handlePin = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(event) {
      var errorMessage, _errorMessage;

      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              event.preventDefault();

              if (message) {
                _context.next = 3;
                break;
              }

              return _context.abrupt("return");

            case 3:
              if (message.pinned) {
                _context.next = 15;
                break;
              }

              _context.prev = 4;
              _context.next = 7;
              return client.pinMessage(message);

            case 7:
              _context.next = 13;
              break;

            case 9:
              _context.prev = 9;
              _context.t0 = _context["catch"](4);
              errorMessage = getErrorNotification && validateAndGetMessage(getErrorNotification, [message.user]);
              notify(errorMessage || t('Error pinning message'), 'error');

            case 13:
              _context.next = 24;
              break;

            case 15:
              _context.prev = 15;
              _context.next = 18;
              return client.unpinMessage(message);

            case 18:
              _context.next = 24;
              break;

            case 20:
              _context.prev = 20;
              _context.t1 = _context["catch"](15);
              _errorMessage = getErrorNotification && validateAndGetMessage(getErrorNotification, [message.user]);
              notify(_errorMessage || t('Error removing message pin'), 'error');

            case 24:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[4, 9], [15, 20]]);
    }));

    return function handlePin(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  return {
    canPin: canPin(),
    handlePin
  };
};

var reactionHandlerWarning = "Reaction handler was called, but it is missing one of its required arguments.\n      Make sure the ChannelContext was properly set and that this hook was initialized with a valid message.";
/**
 * @type {import('../types').useReactionHandler}
 */

var useReactionHandler = function useReactionHandler(message) {
  var _useContext = useContext(ChannelContext),
      client = _useContext.client,
      channel = _useContext.channel,
      updateMessage = _useContext.updateMessage;

  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(reactionType, event) {
      var userExistingReaction, currentUser, originalMessage, reactionChangePromise, messageID, reaction;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (event && event.preventDefault) {
                event.preventDefault();
              }

              if (!(!updateMessage || !message || !channel || !client)) {
                _context.next = 4;
                break;
              }

              console.warn(reactionHandlerWarning);
              return _context.abrupt("return");

            case 4:
              userExistingReaction =
              /** @type { import('stream-chat').ReactionResponse<Record<String, unknown>, import('../types').StreamChatReactUserType> | null } */
              null;
              currentUser = client.userID;

              if (message.own_reactions) {
                message.own_reactions.forEach(function (reaction) {
                  // own user should only ever contain the current user id
                  // just in case we check to prevent bugs with message updates from breaking reactions
                  if (reaction.user && currentUser === reaction.user.id && reaction.type === reactionType) {
                    userExistingReaction = reaction;
                  } else if (reaction.user && currentUser !== reaction.user.id) {
                    console.warn("message.own_reactions contained reactions from a different user, this indicates a bug");
                  }
                });
              }

              originalMessage = message;

              if (!message.id) {
                _context.next = 18;
                break;
              }

              if (userExistingReaction) {
                reactionChangePromise = channel.deleteReaction(message.id, userExistingReaction.type);
              } else {
                // add the reaction
                messageID = message.id;
                reaction = {
                  type: reactionType
                }; // this.props.channel.state.addReaction(tmpReaction, this.props.message);

                reactionChangePromise = channel.sendReaction(messageID, reaction);
              }

              _context.prev = 10;
              _context.next = 13;
              return reactionChangePromise;

            case 13:
              _context.next = 18;
              break;

            case 15:
              _context.prev = 15;
              _context.t0 = _context["catch"](10);
              // revert to the original message if the API call fails
              updateMessage(originalMessage);

            case 18:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[10, 15]]);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();
};
/**
 * @type {import('../types').useReactionClick}
 */

var useReactionClick = function useReactionClick(message, reactionSelectorRef, messageWrapperRef) {
  var _channel$getConfig, _channel$getConfig$ca;

  var _useContext2 = useContext(ChannelContext),
      channel = _useContext2.channel;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      showDetailedReactions = _useState2[0],
      setShowDetailedReactions = _useState2[1];

  var isReactionEnabled = (channel === null || channel === void 0 ? void 0 : (_channel$getConfig = channel.getConfig) === null || _channel$getConfig === void 0 ? void 0 : (_channel$getConfig$ca = _channel$getConfig.call(channel)) === null || _channel$getConfig$ca === void 0 ? void 0 : _channel$getConfig$ca.reactions) !== false;
  var messageDeleted = !!(message !== null && message !== void 0 && message.deleted_at);
  var hasListener = useRef(false);
  /** @type {EventListener} */

  var closeDetailedReactions = useCallback(function (event) {
    var _reactionSelectorRef$;

    if (event.target && // @ts-expect-error
    reactionSelectorRef !== null && reactionSelectorRef !== void 0 && (_reactionSelectorRef$ = reactionSelectorRef.current) !== null && _reactionSelectorRef$ !== void 0 && _reactionSelectorRef$.contains(event.target)) {
      return;
    }

    setShowDetailedReactions(false);
  }, [setShowDetailedReactions, reactionSelectorRef]);
  useEffect(function () {
    var messageWrapper = messageWrapperRef === null || messageWrapperRef === void 0 ? void 0 : messageWrapperRef.current;

    if (showDetailedReactions && !hasListener.current) {
      hasListener.current = true;
      document.addEventListener('click', closeDetailedReactions);
      document.addEventListener('touchend', closeDetailedReactions);

      if (messageWrapper) {
        messageWrapper.addEventListener('mouseleave', closeDetailedReactions);
      }
    }

    if (!showDetailedReactions && hasListener.current) {
      document.removeEventListener('click', closeDetailedReactions);
      document.removeEventListener('touchend', closeDetailedReactions);

      if (messageWrapper) {
        messageWrapper.removeEventListener('mouseleave', closeDetailedReactions);
      }

      hasListener.current = false;
    }

    return function () {
      if (hasListener.current) {
        document.removeEventListener('click', closeDetailedReactions);
        document.removeEventListener('touchend', closeDetailedReactions);

        if (messageWrapper) {
          messageWrapper.removeEventListener('mouseleave', closeDetailedReactions);
        }

        hasListener.current = false;
      }
    };
  }, [showDetailedReactions, closeDetailedReactions, messageWrapperRef]);
  useEffect(function () {
    var messageWrapper = messageWrapperRef === null || messageWrapperRef === void 0 ? void 0 : messageWrapperRef.current;

    if (messageDeleted && hasListener.current) {
      document.removeEventListener('click', closeDetailedReactions);
      document.removeEventListener('touchend', closeDetailedReactions);

      if (messageWrapper) {
        messageWrapper.removeEventListener('mouseleave', closeDetailedReactions);
      }

      hasListener.current = false;
    }
  }, [messageDeleted, closeDetailedReactions, messageWrapperRef]);
  /** @type {(e: MouseEvent) => void} Typescript syntax */

  var onReactionListClick = function onReactionListClick(e) {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }

    setShowDetailedReactions(true);
  };

  return {
    // @ts-expect-error
    onReactionListClick,
    showDetailedReactions,
    isReactionEnabled
  };
};

/**
 * @type {import('../types').useRetryHandler}
 */

var useRetryHandler = function useRetryHandler(customRetrySendMessage) {
  /**
   *@type {import('../types').ChannelContextValue}
   */
  var _useContext = useContext(ChannelContext),
      contextRetrySendMessage = _useContext.retrySendMessage;

  var retrySendMessage = customRetrySendMessage || contextRetrySendMessage;
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(message) {
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(retrySendMessage && message)) {
                _context.next = 3;
                break;
              }

              _context.next = 3;
              return retrySendMessage(message);

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();
};

// @ts-check

/**
 * @type {import('../types').useUserHandler}
 */
var useUserHandler = function useUserHandler(message, eventHandlers) {
  return {
    /** @type {(e: React.MouseEvent<HTMLElement>) => void} Typescript syntax */
    onUserClick: function onUserClick(e) {
      if (typeof (eventHandlers === null || eventHandlers === void 0 ? void 0 : eventHandlers.onUserClickHandler) !== 'function' || !(message !== null && message !== void 0 && message.user)) {
        return;
      }

      eventHandlers.onUserClickHandler(e, message.user);
    },

    /** @type {(e: React.MouseEvent<HTMLElement>) => void} Typescript syntax */
    onUserHover: function onUserHover(e) {
      if (typeof (eventHandlers === null || eventHandlers === void 0 ? void 0 : eventHandlers.onUserHoverHandler) !== 'function' || !(message !== null && message !== void 0 && message.user)) {
        return;
      }

      eventHandlers.onUserHoverHandler(e, message.user);
    }
  };
};

// @ts-check
/**
 * @type {import('../types').useUserRole}
 */

var useUserRole = function useUserRole(message) {
  var _client$user, _channel$state, _channel$state$member, _channel$state2, _channel$state2$membe, _client$user2, _channel$state3, _channel$state3$membe, _channel$state4, _channel$state4$membe;

  var _useContext = useContext(ChannelContext),
      client = _useContext.client,
      channel = _useContext.channel;

  var isMyMessage = !!(message !== null && message !== void 0 && message.user) && !!(client !== null && client !== void 0 && client.user) && client.user.id === message.user.id;
  var isAdmin = (client === null || client === void 0 ? void 0 : (_client$user = client.user) === null || _client$user === void 0 ? void 0 : _client$user.role) === 'admin' || (channel === null || channel === void 0 ? void 0 : (_channel$state = channel.state) === null || _channel$state === void 0 ? void 0 : (_channel$state$member = _channel$state.membership) === null || _channel$state$member === void 0 ? void 0 : _channel$state$member.role) === 'admin';
  var isOwner = (channel === null || channel === void 0 ? void 0 : (_channel$state2 = channel.state) === null || _channel$state2 === void 0 ? void 0 : (_channel$state2$membe = _channel$state2.membership) === null || _channel$state2$membe === void 0 ? void 0 : _channel$state2$membe.role) === 'owner';
  var isModerator = (client === null || client === void 0 ? void 0 : (_client$user2 = client.user) === null || _client$user2 === void 0 ? void 0 : _client$user2.role) === 'channel_moderator' || (channel === null || channel === void 0 ? void 0 : (_channel$state3 = channel.state) === null || _channel$state3 === void 0 ? void 0 : (_channel$state3$membe = _channel$state3.membership) === null || _channel$state3$membe === void 0 ? void 0 : _channel$state3$membe.role) === 'channel_moderator' || (channel === null || channel === void 0 ? void 0 : (_channel$state4 = channel.state) === null || _channel$state4 === void 0 ? void 0 : (_channel$state4$membe = _channel$state4.membership) === null || _channel$state4$membe === void 0 ? void 0 : _channel$state4$membe.role) === 'moderator';
  var canEditMessage = isMyMessage || isModerator || isOwner || isAdmin;
  var canDeleteMessage = canEditMessage;
  return {
    isMyMessage,
    isAdmin,
    isOwner,
    isModerator,
    canEditMessage,
    canDeleteMessage
  };
};

/** @type {React.FC<import("types").MessageActionsBoxProps>} */

var MessageActionsBox = function MessageActionsBox(_ref) {
  var getMessageActions = _ref.getMessageActions,
      handleDelete = _ref.handleDelete,
      handleEdit = _ref.handleEdit,
      handleFlag = _ref.handleFlag,
      handleMute = _ref.handleMute,
      handlePin = _ref.handlePin,
      isUserMuted = _ref.isUserMuted,
      message = _ref.message,
      messageListRect = _ref.messageListRect,
      mine = _ref.mine,
      _ref$open = _ref.open,
      open = _ref$open === void 0 ? false : _ref$open;

  var _useContext = useContext(TranslationContext),
      t = _useContext.t;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      reverse = _useState2[0],
      setReverse = _useState2[1];

  var messageActions = getMessageActions();
  var checkIfReverse = useCallback(function (containerElement) {
    if (!containerElement) {
      setReverse(false);
      return;
    }

    if (open) {
      var containerRect = containerElement.getBoundingClientRect();

      if (mine) {
        setReverse(!!messageListRect && containerRect.left < messageListRect.left);
      } else {
        setReverse(!!messageListRect && containerRect.right + 5 > messageListRect.right);
      }
    }
  }, [messageListRect, mine, open]);
  return /*#__PURE__*/React.createElement("div", {
    "data-testid": "message-actions-box",
    className: "str-chat__message-actions-box\n        ".concat(open ? 'str-chat__message-actions-box--open' : '', "\n        ").concat(mine ? 'str-chat__message-actions-box--mine' : '', "\n        ").concat(reverse ? 'str-chat__message-actions-box--reverse' : '', "\n      "),
    ref: checkIfReverse
  }, /*#__PURE__*/React.createElement("ul", {
    className: "str-chat__message-actions-list"
  }, messageActions.indexOf(MESSAGE_ACTIONS.pin) > -1 && !(message !== null && message !== void 0 && message.parent_id) && /*#__PURE__*/React.createElement("button", {
    onClick: handlePin
  }, /*#__PURE__*/React.createElement("li", {
    className: "str-chat__message-actions-list-item"
  }, !(message !== null && message !== void 0 && message.pinned) ? t('Pin') : t('Unpin'))), messageActions.indexOf(MESSAGE_ACTIONS.flag) > -1 && /*#__PURE__*/React.createElement("button", {
    onClick: handleFlag
  }, /*#__PURE__*/React.createElement("li", {
    className: "str-chat__message-actions-list-item"
  }, t('Flag'))), messageActions.indexOf(MESSAGE_ACTIONS.mute) > -1 && /*#__PURE__*/React.createElement("button", {
    onClick: handleMute
  }, /*#__PURE__*/React.createElement("li", {
    className: "str-chat__message-actions-list-item"
  }, isUserMuted && isUserMuted() ? t('Unmute') : t('Mute'))), messageActions.indexOf(MESSAGE_ACTIONS.edit) > -1 && /*#__PURE__*/React.createElement("button", {
    onClick: handleEdit
  }, /*#__PURE__*/React.createElement("li", {
    className: "str-chat__message-actions-list-item"
  }, t('Edit Message'))), messageActions.indexOf(MESSAGE_ACTIONS.delete) > -1 && /*#__PURE__*/React.createElement("button", {
    onClick: handleDelete
  }, /*#__PURE__*/React.createElement("li", {
    className: "str-chat__message-actions-list-item"
  }, t('Delete')))));
};

MessageActionsBox.propTypes = {
  /** The [message object](https://getstream.io/chat/docs/#message_format) */
  message:
  /** @type {PropTypes.Validator<import('stream-chat').MessageResponse>} */
  PropTypes.object,

  /** If the message actions box should be open or not */
  open: PropTypes.bool,

  /** If message belongs to current user. */
  mine: PropTypes.bool,

  /** DOMRect object for parent MessageList component */
  messageListRect:
  /** @type {PropTypes.Validator<DOMRect>} */
  PropTypes.object,

  /**
   * Handler for flagging a current message
   *
   * @param event React's MouseEventHandler event
   * @returns void
   * */
  handleFlag: PropTypes.func,

  /**
   * Handler for muting a current message
   *
   * @param event React's MouseEventHandler event
   * @returns void
   * */
  handleMute: PropTypes.func,

  /**
   * Handler for editing a current message
   *
   * @param event React's MouseEventHandler event
   * @returns void
   * */
  handleEdit: PropTypes.func,

  /**
   * Handler for deleting a current message
   *
   * @param event React's MouseEventHandler event
   * @returns void
   * */
  handleDelete: PropTypes.func,

  /**
   * Handler for pinning a current message
   *
   * @param event React's MouseEventHandler event
   * @returns void
   * */
  handlePin: PropTypes.func,

  /**
   * Returns array of available message actions for current message.
   * Please check [Message](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message.js) component for default implementation.
   */
  getMessageActions: PropTypes.func.isRequired
};
var MessageActionsBox$1 = /*#__PURE__*/React.memo(MessageActionsBox);

/**
 * @type { React.FC<import('../types').MessageActionsProps> }
 */

var MessageActions = function MessageActions(props) {
  var addNotification = props.addNotification,
      customWrapperClass = props.customWrapperClass,
      getMessageActions = props.getMessageActions,
      getFlagMessageErrorNotification = props.getFlagMessageErrorNotification,
      getFlagMessageSuccessNotification = props.getFlagMessageSuccessNotification,
      getMuteUserErrorNotification = props.getMuteUserErrorNotification,
      getMuteUserSuccessNotification = props.getMuteUserSuccessNotification,
      getPinMessageErrorNotification = props.getPinMessageErrorNotification,
      propHandleDelete = props.handleDelete,
      propHandleFlag = props.handleFlag,
      propHandleMute = props.handleMute,
      propHandlePin = props.handlePin,
      inline = props.inline,
      message = props.message,
      messageListRect = props.messageListRect,
      messageWrapperRef = props.messageWrapperRef,
      _props$pinPermissions = props.pinPermissions,
      pinPermissions = _props$pinPermissions === void 0 ? defaultPinPermissions : _props$pinPermissions,
      setEditingState = props.setEditingState;

  var _useContext = useContext(ChatContext),
      mutes = _useContext.mutes;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      actionsBoxOpen = _useState2[0],
      setActionsBoxOpen = _useState2[1];

  var _useUserRole = useUserRole(message),
      isMyMessage = _useUserRole.isMyMessage;

  var handleDelete = useDeleteHandler(message);
  var handleFlag = useFlagHandler(message, {
    notify: addNotification,
    getSuccessNotification: getFlagMessageErrorNotification,
    getErrorNotification: getFlagMessageSuccessNotification
  });
  var handleMute = useMuteHandler(message, {
    notify: addNotification,
    getErrorNotification: getMuteUserSuccessNotification,
    getSuccessNotification: getMuteUserErrorNotification
  });

  var _usePinHandler = usePinHandler(message, pinPermissions, {
    notify: addNotification,
    getErrorNotification: getPinMessageErrorNotification
  }),
      handlePin = _usePinHandler.handlePin;

  var isMuted = useCallback(function () {
    return isUserMuted(message, mutes);
  }, [message, mutes]);
  var hideOptions = useCallback(function () {
    return setActionsBoxOpen(false);
  }, []);
  var messageActions = getMessageActions();
  var messageDeletedAt = !!(message !== null && message !== void 0 && message.deleted_at);
  useEffect(function () {
    if (messageWrapperRef !== null && messageWrapperRef !== void 0 && messageWrapperRef.current) {
      messageWrapperRef.current.addEventListener('onMouseLeave', hideOptions);
    }
  }, [messageWrapperRef, hideOptions]);
  useEffect(function () {
    if (messageDeletedAt) {
      document.removeEventListener('click', hideOptions);
    }
  }, [messageDeletedAt, hideOptions]);
  useEffect(function () {
    if (actionsBoxOpen) {
      document.addEventListener('click', hideOptions);
    } else {
      document.removeEventListener('click', hideOptions);
    }

    return function () {
      return document.removeEventListener('click', hideOptions);
    };
  }, [actionsBoxOpen, hideOptions]);
  if (messageActions.length === 0) return null;
  return /*#__PURE__*/React.createElement(MessageActionsWrapper, {
    customWrapperClass: customWrapperClass,
    inline: inline,
    setActionsBoxOpen: setActionsBoxOpen
  }, /*#__PURE__*/React.createElement(MessageActionsBox$1, {
    getMessageActions: getMessageActions,
    handleDelete: propHandleDelete || handleDelete,
    handleEdit: setEditingState,
    handleFlag: propHandleFlag || handleFlag,
    handleMute: propHandleMute || handleMute,
    handlePin: propHandlePin || handlePin,
    isUserMuted: isMuted,
    message: message,
    messageListRect: messageListRect,
    mine: isMyMessage,
    open: actionsBoxOpen
  }), /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "4",
    viewBox: "0 0 11 4",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1.5 3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z",
    fillRule: "nonzero"
  })));
};
/**
 * This is a workaround to encompass the different styles message actions can have at the moment
 * while allowing for sharing the component's stateful logic.
 * @type { React.FC<import('../types').MessageActionsWrapperProps> }
 */

var MessageActionsWrapper = function MessageActionsWrapper(props) {
  var children = props.children,
      customWrapperClass = props.customWrapperClass,
      inline = props.inline,
      setActionsBoxOpen = props.setActionsBoxOpen;
  var defaultWrapperClass = 'str-chat__message-simple__actions__action str-chat__message-simple__actions__action--options';
  var wrapperClass = typeof customWrapperClass === 'string' ? customWrapperClass : defaultWrapperClass;
  /** @type {(e: React.MouseEvent) => void} Typescript syntax */

  var onClickOptionsAction = function onClickOptionsAction(e) {
    e.stopPropagation();
    setActionsBoxOpen(true);
  };

  var wrapperProps = {
    'data-testid': 'message-actions',
    onClick: onClickOptionsAction,
    className: wrapperClass
  };
  if (inline) return /*#__PURE__*/React.createElement("span", wrapperProps, children);
  return /*#__PURE__*/React.createElement("div", wrapperProps, children);
};

/**
 * @type { React.FC<import('../types').MessageOptionsProps> }
 */

var MessageOptionsComponent = function MessageOptionsComponent(props) {
  var _props$displayActions = props.displayActions,
      displayActions = _props$displayActions === void 0 ? true : _props$displayActions,
      _props$displayLeft = props.displayLeft,
      displayLeft = _props$displayLeft === void 0 ? true : _props$displayLeft,
      _props$displayReplies = props.displayReplies,
      displayReplies = _props$displayReplies === void 0 ? true : _props$displayReplies,
      propHandleOpenThread = props.handleOpenThread,
      initialMessage = props.initialMessage,
      message = props.message,
      messageWrapperRef = props.messageWrapperRef,
      onReactionListClick = props.onReactionListClick,
      _props$theme = props.theme,
      theme = _props$theme === void 0 ? 'simple' : _props$theme,
      threadList = props.threadList;

  var _useUserRole = useUserRole(message),
      isMyMessage = _useUserRole.isMyMessage;

  var handleOpenThread = useOpenThreadHandler(message);
  /**
   * @type {import('../types').ChannelContextValue}
   */

  var _useContext = useContext(ChannelContext),
      channel = _useContext.channel;

  var channelConfig = channel === null || channel === void 0 ? void 0 : channel.getConfig();
  var messageActions = props.getMessageActions();
  var shouldShowReactions = messageActions.indexOf(MESSAGE_ACTIONS.react) > -1 && channelConfig && channelConfig.reactions;
  var shouldShowReplies = messageActions.indexOf(MESSAGE_ACTIONS.reply) > -1 && displayReplies && !threadList && channelConfig && channelConfig.replies;

  if (!message || message.type === 'error' || message.type === 'system' || message.type === 'ephemeral' || message.status === 'failed' || message.status === 'sending' || initialMessage) {
    return null;
  }

  if (isMyMessage && displayLeft) {
    return /*#__PURE__*/React.createElement("div", {
      "data-testid": "message-options-left",
      className: "str-chat__message-".concat(theme, "__actions")
    }, displayActions && /*#__PURE__*/React.createElement(MessageActions, _extends({}, props, {
      messageWrapperRef: messageWrapperRef
    })), shouldShowReplies && /*#__PURE__*/React.createElement("div", {
      "data-testid": "thread-action",
      onClick: propHandleOpenThread || handleOpenThread,
      className: "str-chat__message-".concat(theme, "__actions__action str-chat__message-").concat(theme, "__actions__action--thread")
    }, /*#__PURE__*/React.createElement(ThreadIcon, null)), shouldShowReactions && /*#__PURE__*/React.createElement("div", {
      "data-testid": "message-reaction-action",
      className: "str-chat__message-".concat(theme, "__actions__action str-chat__message-").concat(theme, "__actions__action--reactions"),
      onClick: onReactionListClick
    }, /*#__PURE__*/React.createElement(ReactionIcon, null)));
  }

  return /*#__PURE__*/React.createElement("div", {
    "data-testid": "message-options",
    className: "str-chat__message-".concat(theme, "__actions")
  }, shouldShowReactions && /*#__PURE__*/React.createElement("div", {
    "data-testid": "message-reaction-action",
    className: "str-chat__message-".concat(theme, "__actions__action str-chat__message-").concat(theme, "__actions__action--reactions"),
    onClick: onReactionListClick
  }, /*#__PURE__*/React.createElement(ReactionIcon, null)), shouldShowReplies && /*#__PURE__*/React.createElement("div", {
    onClick: propHandleOpenThread || handleOpenThread,
    "data-testid": "thread-action",
    className: "str-chat__message-".concat(theme, "__actions__action str-chat__message-").concat(theme, "__actions__action--thread")
  }, /*#__PURE__*/React.createElement(ThreadIcon, null)), displayActions && /*#__PURE__*/React.createElement(MessageActions, _extends({}, props, {
    messageWrapperRef: messageWrapperRef
  })));
};

var MessageOptions = /*#__PURE__*/React.memo(MessageOptionsComponent);

/**
 * @type { React.FC<import('../types').MessageTextProps> }
 */

var MessageTextComponent = function MessageTextComponent(props) {
  var _message$i18n;

  var _props$ReactionsList = props.ReactionsList,
      ReactionsList = _props$ReactionsList === void 0 ? DefaultReactionsList : _props$ReactionsList,
      _props$ReactionSelect = props.ReactionSelector,
      ReactionSelector = _props$ReactionSelect === void 0 ? DefaultReactionSelector : _props$ReactionSelect,
      propOnMentionsClick = props.onMentionsClickMessage,
      propOnMentionsHover = props.onMentionsHoverMessage,
      customWrapperClass = props.customWrapperClass,
      customInnerClass = props.customInnerClass,
      _props$theme = props.theme,
      theme = _props$theme === void 0 ? 'simple' : _props$theme,
      message = props.message,
      unsafeHTML = props.unsafeHTML,
      customOptionProps = props.customOptionProps;
  var reactionSelectorRef = useRef(
  /** @type {HTMLDivElement | null} */
  null);

  var _useMobilePress = useMobilePress(),
      handleMobilePress = _useMobilePress.handleMobilePress;

  var _useMentionsUIHandler = useMentionsUIHandler(message, {
    onMentionsClick: propOnMentionsClick,
    onMentionsHover: propOnMentionsHover
  }),
      onMentionsClick = _useMentionsUIHandler.onMentionsClick,
      onMentionsHover = _useMentionsUIHandler.onMentionsHover;

  var _useReactionClick = useReactionClick(message, reactionSelectorRef),
      onReactionListClick = _useReactionClick.onReactionListClick,
      showDetailedReactions = _useReactionClick.showDetailedReactions,
      isReactionEnabled = _useReactionClick.isReactionEnabled;

  var _useContext = useContext(TranslationContext),
      t = _useContext.t,
      userLanguage = _useContext.userLanguage;

  var hasReactions = messageHasReactions(message);
  var hasAttachment = messageHasAttachments(message);
  var handleReaction = useReactionHandler(message);
  var messageTextToRender = // @ts-expect-error
  (message === null || message === void 0 ? void 0 : (_message$i18n = message.i18n) === null || _message$i18n === void 0 ? void 0 : _message$i18n["".concat(userLanguage, "_text")]) || (message === null || message === void 0 ? void 0 : message.text);
  var messageMentionedUsersItem = message === null || message === void 0 ? void 0 : message.mentioned_users;
  var messageText = useMemo(function () {
    return renderText(messageTextToRender, messageMentionedUsersItem);
  }, [messageMentionedUsersItem, messageTextToRender]);
  var wrapperClass = customWrapperClass || 'str-chat__message-text';
  var innerClass = customInnerClass || "str-chat__message-text-inner str-chat__message-".concat(theme, "-text-inner");

  if (!(message !== null && message !== void 0 && message.text)) {
    return null;
  }

  return /*#__PURE__*/React.createElement("div", {
    className: wrapperClass
  }, /*#__PURE__*/React.createElement("div", {
    "data-testid": "message-text-inner-wrapper",
    className: "\n          ".concat(innerClass, "\n          ").concat(hasAttachment ? " str-chat__message-".concat(theme, "-text-inner--has-attachment") : '', "\n          ").concat(isOnlyEmojis(message.text) ? " str-chat__message-".concat(theme, "-text-inner--is-emoji") : '', "\n        ").trim(),
    onMouseOver: onMentionsHover,
    onClick: onMentionsClick
  }, message.type === 'error' && /*#__PURE__*/React.createElement("div", {
    className: "str-chat__".concat(theme, "-message--error-message")
  }, t && t('Error · Unsent')), message.status === 'failed' && /*#__PURE__*/React.createElement("div", {
    className: "str-chat__".concat(theme, "-message--error-message")
  }, t && t('Message Failed · Click to try again')), unsafeHTML && message.html ? /*#__PURE__*/React.createElement("div", {
    dangerouslySetInnerHTML: {
      __html: message.html
    }
  }) : /*#__PURE__*/React.createElement("div", {
    onClick: handleMobilePress
  }, messageText), hasReactions && !showDetailedReactions && isReactionEnabled && /*#__PURE__*/React.createElement(ReactionsList, {
    reactions: message.latest_reactions,
    reaction_counts: message.reaction_counts || undefined,
    own_reactions: message.own_reactions,
    onClick: onReactionListClick,
    reverse: true
  }), showDetailedReactions && isReactionEnabled && /*#__PURE__*/React.createElement(ReactionSelector, {
    handleReaction: handleReaction,
    detailedView: true,
    reaction_counts: message.reaction_counts || undefined,
    latest_reactions: message.latest_reactions,
    own_reactions: message.own_reactions,
    ref: reactionSelectorRef
  })), /*#__PURE__*/React.createElement(MessageOptions, _extends({}, props, customOptionProps, {
    onReactionListClick: onReactionListClick
  })));
};

var MessageText = /*#__PURE__*/React.memo(MessageTextComponent);

// @ts-check
/**
 * @type{React.FC<import('../types').MessageDeletedProps>}
 */

var MessageDeleted = function MessageDeleted(props) {
  var message = props.message;

  var _useContext = useContext(TranslationContext),
      t = _useContext.t;

  var _useUserRole = useUserRole(message),
      isMyMessage = _useUserRole.isMyMessage;

  if (props.isMyMessage) {
    console.warn('The isMyMessage is deprecated, and will be removed in the next major release.');
  }

  var messageClasses = props.isMyMessage && props.isMyMessage(message) || isMyMessage ? 'str-chat__message str-chat__message--me str-chat__message-simple str-chat__message-simple--me' : 'str-chat__message str-chat__message-simple';
  return /*#__PURE__*/React.createElement("div", {
    key: message.id,
    className: "".concat(messageClasses, " str-chat__message--deleted ").concat(message.type, " "),
    "data-testid": 'message-deleted-component'
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__message--deleted-inner"
  }, t && t('This message was deleted...')));
};

MessageDeleted.propTypes = {
  /** The [message object](https://getstream.io/chat/docs/#message_format) */
  // @ts-expect-error
  // Ignoring this for now as Typescript definitions on 'stream-chat' are wrong.
  message: MessagePropTypes,

  /** @deprecated This is no longer needed. The component should now rely on the user role custom hook */
  isMyMessage: PropTypes.func
};

// @ts-check
var defaultTimestampFormat = 'h:mmA';
var notValidDateWarning = 'MessageTimestamp was called without a message, or message has invalid created_at date.';
var noParsingFunctionWarning = 'MessageTimestamp was called but there is no datetime parsing function available';
/**
 * @type { (
 *   messageCreatedAt?: string,
 *   formatDate?: import('../types').MessageTimestampProps['formatDate'],
 *   calendar?: boolean,
 *   tDateTimeParser?: import('../types').MessageTimestampProps['tDateTimeParser'],
 *   format?: string,
 * ) => string | null }
 */

function getDateString(messageCreatedAt, formatDate, calendar, tDateTimeParser, format) {
  if (!messageCreatedAt || !Date.parse(messageCreatedAt)) {
    console.warn(notValidDateWarning);
    return null;
  }

  if (typeof formatDate === 'function') {
    return formatDate(new Date(messageCreatedAt));
  }

  if (!tDateTimeParser) {
    console.warn(noParsingFunctionWarning);
    return null;
  }

  var parsedTime = tDateTimeParser(messageCreatedAt);

  if (calendar && typeof parsedTime.calendar !== 'function') {
    return null;
  }

  return calendar ? parsedTime.calendar() : parsedTime.format(format);
}
/**
 * @typedef { import('../types').MessageTimestampProps } Props
 * @type { React.FC<Props> }
 */


var MessageTimestamp = function MessageTimestamp(props) {
  var message = props.message,
      formatDate = props.formatDate,
      propTDatetimeParser = props.tDateTimeParser,
      _props$customClass = props.customClass,
      customClass = _props$customClass === void 0 ? '' : _props$customClass,
      _props$format = props.format,
      format = _props$format === void 0 ? defaultTimestampFormat : _props$format,
      _props$calendar = props.calendar,
      calendar = _props$calendar === void 0 ? false : _props$calendar;

  var _useContext = useContext(TranslationContext),
      contextTDateTimeParser = _useContext.tDateTimeParser;

  var tDateTimeParser = propTDatetimeParser || contextTDateTimeParser;
  var createdAt = message === null || message === void 0 ? void 0 : message.created_at;
  var when = useMemo(function () {
    return getDateString(createdAt, formatDate, calendar, tDateTimeParser, format);
  }, [formatDate, calendar, tDateTimeParser, format, createdAt]);

  if (!when) {
    return null;
  }

  return /*#__PURE__*/React.createElement("time", {
    className: customClass,
    dateTime: createdAt,
    title: createdAt
  }, when);
};

var MessageTimestamp$1 = /*#__PURE__*/React.memo(MessageTimestamp);

/**
 * MessageSimple - Render component, should be used together with the Message component
 *
 * @example ../../docs/MessageSimple.md
 * @type { React.FC<import('../types').MessageSimpleProps> }
 */

var MessageSimple = function MessageSimple(props) {
  var clearEditingState = props.clearEditingState,
      editing = props.editing,
      _props$EditMessageInp = props.EditMessageInput,
      EditMessageInput = _props$EditMessageInp === void 0 ? EditMessageForm : _props$EditMessageInp,
      message = props.message,
      threadList = props.threadList,
      formatDate = props.formatDate,
      propUpdateMessage = props.updateMessage,
      propHandleAction = props.handleAction,
      propHandleOpenThread = props.handleOpenThread,
      propHandleReaction = props.handleReaction,
      propHandleRetry = props.handleRetry,
      onUserClickCustomHandler = props.onUserClick,
      onUserHoverCustomHandler = props.onUserHover,
      propTDateTimeParser = props.tDateTimeParser;

  var _useContext = useContext(ChannelContext),
      channelUpdateMessage = _useContext.updateMessage;

  var updateMessage = propUpdateMessage || channelUpdateMessage;

  var _useUserRole = useUserRole(message),
      isMyMessage = _useUserRole.isMyMessage;

  var handleOpenThread = useOpenThreadHandler(message);
  var handleReaction = useReactionHandler(message);
  var handleAction = useActionHandler(message);
  var handleRetry = useRetryHandler();

  var _useUserHandler = useUserHandler(message, {
    onUserClickHandler: onUserClickCustomHandler,
    onUserHoverHandler: onUserHoverCustomHandler
  }),
      onUserClick = _useUserHandler.onUserClick,
      onUserHover = _useUserHandler.onUserHover;

  var reactionSelectorRef = /*#__PURE__*/React.createRef();
  var messageWrapperRef = useRef(null);

  var _useReactionClick = useReactionClick(message, reactionSelectorRef),
      onReactionListClick = _useReactionClick.onReactionListClick,
      showDetailedReactions = _useReactionClick.showDetailedReactions,
      isReactionEnabled = _useReactionClick.isReactionEnabled;

  var _props$Attachment = props.Attachment,
      Attachment$1 = _props$Attachment === void 0 ? Attachment : _props$Attachment,
      _props$Avatar = props.Avatar,
      Avatar$1 = _props$Avatar === void 0 ? Avatar : _props$Avatar,
      _props$MessageDeleted = props.MessageDeleted,
      MessageDeleted$1 = _props$MessageDeleted === void 0 ? MessageDeleted : _props$MessageDeleted,
      _props$ReactionSelect = props.ReactionSelector,
      ReactionSelector = _props$ReactionSelect === void 0 ? DefaultReactionSelector : _props$ReactionSelect,
      _props$ReactionsList = props.ReactionsList,
      ReactionsList = _props$ReactionsList === void 0 ? DefaultReactionsList : _props$ReactionsList;
  var hasReactions = messageHasReactions(message);
  var hasAttachment = messageHasAttachments(message);
  var messageClasses = isMyMessage ? 'str-chat__message str-chat__message--me str-chat__message-simple str-chat__message-simple--me' : 'str-chat__message str-chat__message-simple';

  if ((message === null || message === void 0 ? void 0 : message.type) === 'message.read' || (message === null || message === void 0 ? void 0 : message.type) === 'message.date') {
    return null;
  }

  if (message !== null && message !== void 0 && message.deleted_at) {
    return smartRender(MessageDeleted$1, {
      message
    }, null);
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, editing && /*#__PURE__*/React.createElement(Modal, {
    open: editing,
    onClose: clearEditingState
  }, /*#__PURE__*/React.createElement(MessageInput$1, _extends({
    Input: EditMessageInput,
    message: message,
    clearEditingState: clearEditingState,
    updateMessage: updateMessage
  }, props.additionalMessageInputProps))), message && /*#__PURE__*/React.createElement("div", {
    key: message.id || '',
    className: "\n\t\t\t\t\t\t".concat(messageClasses, "\n\t\t\t\t\t\tstr-chat__message--").concat(message.type, "\n\t\t\t\t\t\tstr-chat__message--").concat(message.status, "\n\t\t\t\t\t\t").concat(message.text ? 'str-chat__message--has-text' : 'has-no-text', "\n\t\t\t\t\t\t").concat(hasAttachment ? 'str-chat__message--has-attachment' : '', "\n            ").concat(hasReactions && isReactionEnabled ? 'str-chat__message--with-reactions' : '', "\n            ").concat(message !== null && message !== void 0 && message.pinned ? 'pinned-message' : '', "\n\t\t\t\t\t").trim(),
    ref: messageWrapperRef
  }, /*#__PURE__*/React.createElement(MessageSimpleStatus, props), message.user && /*#__PURE__*/React.createElement(Avatar$1, {
    image: message.user.image,
    name: message.user.name || message.user.id,
    onClick: onUserClick,
    onMouseOver: onUserHover
  }), /*#__PURE__*/React.createElement("div", {
    "data-testid": "message-inner",
    className: "str-chat__message-inner",
    onClick: function onClick() {
      if (message.status === 'failed' && (propHandleRetry || handleRetry)) {
        var retryHandler = propHandleRetry || handleRetry; // FIXME: type checking fails here because in the case of a failed message,
        // `message` is of type Client.Message (i.e. request object)
        // instead of Client.MessageResponse (i.e. server response object)
        // @ts-expect-error

        retryHandler(message);
      }
    }
  }, !message.text && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MessageOptions, _extends({}, props, {
    messageWrapperRef: messageWrapperRef,
    onReactionListClick: onReactionListClick,
    handleOpenThread: propHandleOpenThread
  })), hasReactions && !showDetailedReactions && isReactionEnabled && /*#__PURE__*/React.createElement(ReactionsList, {
    reactions: message.latest_reactions,
    reaction_counts: message.reaction_counts || undefined,
    own_reactions: message.own_reactions,
    onClick: onReactionListClick,
    reverse: true
  }), showDetailedReactions && isReactionEnabled && /*#__PURE__*/React.createElement(ReactionSelector, {
    handleReaction: propHandleReaction || handleReaction,
    detailedView: true,
    reaction_counts: message.reaction_counts || undefined,
    latest_reactions: message.latest_reactions,
    own_reactions: message.own_reactions,
    ref: reactionSelectorRef
  })), (message === null || message === void 0 ? void 0 : message.attachments) && Attachment$1 && /*#__PURE__*/React.createElement(Attachment$1, {
    attachments: message.attachments,
    actionHandler: propHandleAction || handleAction
  }), message.text && /*#__PURE__*/React.createElement(MessageText, _extends({}, props, {
    customOptionProps: {
      messageWrapperRef,
      handleOpenThread: propHandleOpenThread
    } // FIXME: There's some unmatched definition between the infered and the declared
    // ReactionSelector reference
    // @ts-expect-error
    ,
    reactionSelectorRef: reactionSelectorRef
  })), message.mml && /*#__PURE__*/React.createElement(MML, {
    source: message.mml,
    actionHandler: handleAction,
    align: isMyMessage ? 'right' : 'left'
  }), !threadList && message.reply_count !== 0 && /*#__PURE__*/React.createElement("div", {
    className: "str-chat__message-simple-reply-button"
  }, /*#__PURE__*/React.createElement(MessageRepliesCountButton$1, {
    onClick: propHandleOpenThread || handleOpenThread,
    reply_count: message.reply_count
  })), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__message-data str-chat__message-simple-data"
  }, !isMyMessage && message.user ? /*#__PURE__*/React.createElement("span", {
    className: "str-chat__message-simple-name"
  }, message.user.name || message.user.id) : null, /*#__PURE__*/React.createElement(MessageTimestamp$1, {
    customClass: "str-chat__message-simple-timestamp",
    tDateTimeParser: propTDateTimeParser,
    formatDate: formatDate,
    message: message,
    calendar: true
  })))));
};
/** @type { React.FC<import('../types').MessageSimpleProps> } */


var MessageSimpleStatus = function MessageSimpleStatus(_ref) {
  var _client$user;

  var _ref$Avatar = _ref.Avatar,
      Avatar$1 = _ref$Avatar === void 0 ? Avatar : _ref$Avatar,
      readBy = _ref.readBy,
      message = _ref.message,
      threadList = _ref.threadList,
      lastReceivedId = _ref.lastReceivedId;

  var _useContext2 = useContext(TranslationContext),
      t = _useContext2.t;

  var _useContext3 = useContext(ChannelContext),
      client = _useContext3.client;

  var _useUserRole2 = useUserRole(message),
      isMyMessage = _useUserRole2.isMyMessage;

  if (!isMyMessage || (message === null || message === void 0 ? void 0 : message.type) === 'error') {
    return null;
  }

  var justReadByMe = readBy && readBy.length === 1 && readBy[0] && client && readBy[0].id === ((_client$user = client.user) === null || _client$user === void 0 ? void 0 : _client$user.id);

  if (message && message.status === 'sending') {
    return /*#__PURE__*/React.createElement("span", {
      className: "str-chat__message-simple-status",
      "data-testid": "message-status-sending"
    }, /*#__PURE__*/React.createElement(Tooltip$1, null, t && t('Sending...')), /*#__PURE__*/React.createElement(DefaultLoadingIndicator, null));
  }

  if (readBy && readBy.length !== 0 && !threadList && !justReadByMe) {
    var lastReadUser = readBy.filter(
    /** @type {(item: import('stream-chat').UserResponse) => boolean} Typescript syntax */
    function (item) {
      var _client$user2;

      return !!item && !!client && item.id !== ((_client$user2 = client.user) === null || _client$user2 === void 0 ? void 0 : _client$user2.id);
    })[0];
    return /*#__PURE__*/React.createElement("span", {
      className: "str-chat__message-simple-status",
      "data-testid": "message-status-read-by"
    }, /*#__PURE__*/React.createElement(Tooltip$1, null, readBy && getReadByTooltipText(readBy, t, client)), /*#__PURE__*/React.createElement(Avatar$1, {
      name: lastReadUser === null || lastReadUser === void 0 ? void 0 : lastReadUser.name,
      image: lastReadUser === null || lastReadUser === void 0 ? void 0 : lastReadUser.image,
      size: 15
    }), readBy.length > 2 && /*#__PURE__*/React.createElement("span", {
      className: "str-chat__message-simple-status-number",
      "data-testid": "message-status-read-by-many"
    }, readBy.length - 1));
  }

  if (message && message.status === 'received' && message.id === lastReceivedId && !threadList) {
    return /*#__PURE__*/React.createElement("span", {
      className: "str-chat__message-simple-status",
      "data-testid": "message-status-received"
    }, /*#__PURE__*/React.createElement(Tooltip$1, null, t && t('Delivered')), /*#__PURE__*/React.createElement(DeliveredCheckIcon, null));
  }

  return null;
};

MessageSimple.propTypes = {
  /** The [message object](https://getstream.io/chat/docs/#message_format) */
  message:
  /** @type {PropTypes.Validator<import('stream-chat').MessageResponse>} */
  PropTypes.object.isRequired,

  /**
   * The attachment UI component.
   * Default: [Attachment](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment.js)
   * */
  Attachment:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').WrapperAttachmentUIComponentProps>>} */
  PropTypes.elementType,

  /**
   * Custom UI component to display user avatar
   *
   * Defaults to and accepts same props as: [Avatar](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Avatar/Avatar.js)
   * */
  Avatar:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').AvatarProps>>} */
  PropTypes.elementType,

  /**
   * Custom UI component to override default edit message input
   *
   * Defaults to and accepts same props as: [EditMessageForm](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/EditMessageForm.js)
   * */
  EditMessageInput:
  /** @type {PropTypes.Validator<React.FC<import("types").MessageInputProps>>} */
  PropTypes.elementType,

  /**
   * @deprecated Its not recommended to use this anymore. All the methods in this HOC are provided explicitly.
   *
   * The higher order message component, most logic is delegated to this component
   * @see See [Message HOC](https://getstream.github.io/stream-chat-react/#message) for example
   *
   * */
  Message:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').MessageUIComponentProps>>} */
  PropTypes.oneOfType([PropTypes.node, PropTypes.func, PropTypes.object]),

  /** render HTML instead of markdown. Posting HTML is only allowed server-side */
  unsafeHTML: PropTypes.bool,

  /** Client object */
  // @ts-expect-error
  client: PropTypes.object,

  /** If its parent message in thread. */
  initialMessage: PropTypes.bool,

  /** Channel config object */
  channelConfig:
  /** @type {PropTypes.Validator<import('stream-chat').ChannelConfig>} */
  PropTypes.object,

  /** Override the default formatting of the date. This is a function that has access to the original date object. Returns a string or Node  */
  formatDate: PropTypes.func,

  /** If component is in thread list */
  threadList: PropTypes.bool,

  /**
   * Function to open thread on current message
   * @deprecated The component now relies on the useThreadHandler custom hook
   * You can customize the behaviour for your thread handler on the <Channel> component instead.
   */
  handleOpenThread: PropTypes.func,

  /** If the message is in edit state */
  editing: PropTypes.bool,

  /** Function to exit edit state */
  clearEditingState: PropTypes.func,

  /** Returns true if message belongs to current user */
  isMyMessage: PropTypes.func,

  /**
   * Returns all allowed actions on message by current user e.g., ['edit', 'delete', 'flag', 'mute', 'react', 'reply']
   * Please check [Message](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message.js) component for default implementation.
   * */
  getMessageActions: PropTypes.func.isRequired,

  /**
   * Function to publish updates on message to channel
   *
   * @param message Updated [message object](https://getstream.io/chat/docs/#message_format)
   * */
  updateMessage: PropTypes.func,

  /**
   * Reattempt sending a message
   * @param message A [message object](https://getstream.io/chat/docs/#message_format) to resent.
   * @deprecated This component now relies on the useRetryHandler custom hook.
   */
  handleRetry: PropTypes.func,

  /**
   * Add or remove reaction on message
   *
   * @param type Type of reaction - 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry'
   * @param event Dom event which triggered this function
   * @deprecated This component now relies on the useReactionHandler custom hook.
   */
  handleReaction: PropTypes.func,

  /**
   * A component to display the selector that allows a user to react to a certain message.
   */
  ReactionSelector:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').ReactionSelectorProps>>} */
  PropTypes.elementType,

  /**
   * A component to display the a message list of reactions.
   */
  ReactionsList:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').ReactionsListProps>>} */
  PropTypes.elementType,

  /** If actions such as edit, delete, flag, mute are enabled on message */
  actionsEnabled: PropTypes.bool,

  /** DOMRect object for parent MessageList component */
  messageListRect: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
    bottom: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    toJSON: PropTypes.func.isRequired
  }),

  /**
   * @param name {string} Name of action
   * @param value {string} Value of action
   * @param event Dom event that triggered this handler
   * @deprecated This component now relies on the useActionHandler custom hook, and this prop will be removed on the next major release.
   */
  handleAction: PropTypes.func,

  /**
   * The handler for hover event on @mention in message
   *
   * @param event Dom hover event which triggered handler.
   * @param user Target user object
   * @deprecated This component now relies on the useMentionsHandler custom hook, and this prop will be removed on the next major release.
   * You can customize the behaviour for your mention handler on the <Channel> component instead.
   */
  onMentionsHoverMessage: PropTypes.func,

  /**
   * The handler for click event on @mention in message
   *
   * @param event Dom click event which triggered handler.
   * @param user Target user object
   * @deprecated This component now relies on the useMentionsHandler custom hook, and this prop will be removed on the next major release.
   * You can customize the behaviour for your mention handler on the <Channel> component instead.
   */
  onMentionsClickMessage: PropTypes.func,

  /**
   * The handler for click event on the user that posted the message
   *
   * @param event Dom click event which triggered handler.
   */
  onUserClick: PropTypes.func,

  /**
   * The handler for mouseOver event on the user that posted the message
   *
   * @param event Dom mouseOver event which triggered handler.
   */
  onUserHover: PropTypes.func,

  /**
   * Additional props for underlying MessageInput component.
   * Available props - https://getstream.github.io/stream-chat-react/#messageinput
   * */
  additionalMessageInputProps: PropTypes.object,

  /**
   * The component that will be rendered if the message has been deleted.
   * All of Message's props are passed into this component.
   */
  MessageDeleted:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').MessageDeletedProps>>} */
  PropTypes.elementType
};
var MessageSimple$1 = /*#__PURE__*/React.memo(MessageSimple, areMessagePropsEqual);

/**
 * Message - A high level component which implements all the logic required for a message.
 * The actual rendering of the message is delegated via the "Message" property
 *
 * @example ../../docs/Message.md
 * @type { React.FC<import('../types').MessageComponentProps> }
 */

var Message = function Message(props) {
  var addNotification = props.addNotification,
      propChannel = props.channel,
      formatDate = props.formatDate,
      getFlagMessageErrorNotification = props.getFlagMessageErrorNotification,
      getFlagMessageSuccessNotification = props.getFlagMessageSuccessNotification,
      getMuteUserErrorNotification = props.getMuteUserErrorNotification,
      getMuteUserSuccessNotification = props.getMuteUserSuccessNotification,
      getPinMessageErrorNotification = props.getPinMessageErrorNotification,
      _props$groupStyles = props.groupStyles,
      groupStyles = _props$groupStyles === void 0 ? [] : _props$groupStyles,
      _props$Message = props.Message,
      MessageUIComponent = _props$Message === void 0 ? MessageSimple$1 : _props$Message,
      message = props.message,
      _props$messageActions = props.messageActions,
      messageActions = _props$messageActions === void 0 ? Object.keys(MESSAGE_ACTIONS) : _props$messageActions,
      propOnMentionsClick = props.onMentionsClick,
      propOnMentionsHover = props.onMentionsHover,
      propOnUserClick = props.onUserClick,
      propOnUserHover = props.onUserHover,
      propOpenThread = props.openThread,
      _props$pinPermissions = props.pinPermissions,
      pinPermissions = _props$pinPermissions === void 0 ? defaultPinPermissions : _props$pinPermissions,
      propRetrySendMessage = props.retrySendMessage;

  var _useContext = useContext(ChannelContext),
      contextChannel = _useContext.channel;

  var channel = propChannel || contextChannel;
  var channelConfig = (channel === null || channel === void 0 ? void 0 : channel.getConfig) && channel.getConfig();
  var handleAction = useActionHandler(message);
  var handleDelete = useDeleteHandler(message);

  var _useEditHandler = useEditHandler(),
      editing = _useEditHandler.editing,
      setEdit = _useEditHandler.setEdit,
      clearEdit = _useEditHandler.clearEdit;

  var handleOpenThread = useOpenThreadHandler(message, propOpenThread);
  var handleReaction = useReactionHandler(message);
  var handleRetry = useRetryHandler(propRetrySendMessage);
  var handleFlag = useFlagHandler(message, {
    notify: addNotification,
    getSuccessNotification: getFlagMessageSuccessNotification,
    getErrorNotification: getFlagMessageErrorNotification
  });
  var handleMute = useMuteHandler(message, {
    notify: addNotification,
    getSuccessNotification: getMuteUserSuccessNotification,
    getErrorNotification: getMuteUserErrorNotification
  });

  var _useMentionsHandler = useMentionsHandler(message, {
    onMentionsClick: propOnMentionsClick,
    onMentionsHover: propOnMentionsHover
  }),
      onMentionsClick = _useMentionsHandler.onMentionsClick,
      onMentionsHover = _useMentionsHandler.onMentionsHover;

  var _usePinHandler = usePinHandler(message, pinPermissions, {
    notify: addNotification,
    getErrorNotification: getPinMessageErrorNotification
  }),
      canPin = _usePinHandler.canPin,
      handlePin = _usePinHandler.handlePin;

  var _useUserHandler = useUserHandler(message, {
    onUserClickHandler: propOnUserClick,
    onUserHoverHandler: propOnUserHover
  }),
      onUserClick = _useUserHandler.onUserClick,
      onUserHover = _useUserHandler.onUserHover;

  var _useUserRole = useUserRole(message),
      _isMyMessage = _useUserRole.isMyMessage,
      isAdmin = _useUserRole.isAdmin,
      isModerator = _useUserRole.isModerator,
      isOwner = _useUserRole.isOwner;

  var canEdit = _isMyMessage || isModerator || isOwner || isAdmin;
  var canDelete = canEdit;
  var canReact = true;
  var canReply = true;
  var messageActionsHandler = useCallback(function () {
    if (!message || !messageActions) {
      return [];
    }

    return getMessageActions(messageActions, {
      canDelete,
      canEdit,
      canPin,
      canReply,
      canReact,
      canFlag: !_isMyMessage,
      canMute: !_isMyMessage && !!(channelConfig !== null && channelConfig !== void 0 && channelConfig.mutes)
    });
  }, [canDelete, canEdit, canPin, canReply, canReact, channelConfig === null || channelConfig === void 0 ? void 0 : channelConfig.mutes, _isMyMessage, message, messageActions]);
  var actionsEnabled = message && message.type === 'regular' && message.status === 'received';
  return MessageUIComponent && /*#__PURE__*/React.createElement(MessageUIComponent, _extends({}, props, {
    actionsEnabled: actionsEnabled,
    channelConfig: channelConfig,
    clearEditingState: clearEdit,
    editing: editing,
    formatDate: formatDate,
    getMessageActions: messageActionsHandler,
    groupStyles: groupStyles,
    handleAction: handleAction,
    handleDelete: handleDelete,
    handleEdit: setEdit,
    handleFlag: handleFlag,
    handleMute: handleMute,
    handlePin: handlePin,
    handleReaction: handleReaction,
    handleRetry: handleRetry,
    handleOpenThread: handleOpenThread,
    isMyMessage: function isMyMessage() {
      return _isMyMessage;
    },
    Message: MessageUIComponent,
    onMentionsClickMessage: onMentionsClick,
    onMentionsHoverMessage: onMentionsHover,
    onUserClick: onUserClick,
    onUserHover: onUserHover,
    setEditingState: setEdit
  }));
};

Message.propTypes = {
  /** The message object */
  message:
  /** @type {PropTypes.Validator<import('stream-chat').MessageResponse>} */
  PropTypes.shape({
    text: PropTypes.string.isRequired,
    html: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    reaction_counts: PropTypes.objectOf(PropTypes.number.isRequired),
    reaction_scores: PropTypes.objectOf(PropTypes.number.isRequired),
    created_at: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    updated_at: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  }).isRequired,

  /** The client connection object for connecting to Stream */
  client:
  /** @type {PropTypes.Validator<import('../types').StreamChatReactClient>} */
  PropTypes.objectOf(checkClientPropType),

  /** The current channel this message is displayed in */
  channel:
  /** @type {PropTypes.Validator<ReturnType<import('../types').StreamChatReactClient['channel']>>} */
  PropTypes.objectOf(checkChannelPropType),

  /** A list of users that have read this message */
  readBy: PropTypes.array,

  /** groupStyles, a list of styles to apply to this message. ie. top, bottom, single etc */
  groupStyles: PropTypes.array,

  /** Override the default formatting of the date. This is a function that has access to the original date object. Returns a string or Node  */
  formatDate: PropTypes.func,

  /**
   * Custom UI component to display user avatar
   *
   * Defaults to and accepts same props as: [Avatar](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Avatar/Avatar.js)
   * */
  Avatar:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').AvatarProps>>} */
  PropTypes.elementType,

  /**
   * Message UI component to display a message in message list.
   * Available from [channel context](https://getstream.github.io/stream-chat-react/#channelcontext)
   * */
  Message:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').MessageUIComponentProps>>} */
  PropTypes.elementType,

  /**
   * The component that will be rendered if the message has been deleted.
   * All props are passed into this component.
   */
  MessageDeleted:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').MessageDeletedProps>>} */
  PropTypes.elementType,

  /**
   * A component to display the selector that allows a user to react to a certain message.
   */
  ReactionSelector:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').ReactionSelectorProps>>} */
  PropTypes.elementType,

  /**
   * A component to display the a message list of reactions.
   */
  ReactionsList:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').ReactionsListProps>>} */
  PropTypes.elementType,

  /**
   * Attachment UI component to display attachment in individual message.
   * Available from [channel context](https://getstream.github.io/stream-chat-react/#channelcontext)
   * */
  Attachment:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').WrapperAttachmentUIComponentProps>>} */
  PropTypes.elementType,

  /** render HTML instead of markdown. Posting HTML is only allowed server-side */
  unsafeHTML: PropTypes.bool,

  /**
   * Array of allowed actions on message. e.g. ['edit', 'delete', 'flag', 'mute', 'react', 'reply']
   * If all the actions need to be disabled, empty array or false should be provided as value of prop.
   * */
  messageActions: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),

  /**
   * Function that returns message/text as string to be shown as notification, when request for flagging a message is successful
   *
   * This function should accept following params:
   *
   * @param message A [message object](https://getstream.io/chat/docs/#message_format) which is flagged.
   *
   * */
  getFlagMessageSuccessNotification: PropTypes.func,

  /**
   * Function that returns message/text as string to be shown as notification, when request for flagging a message runs into error
   *
   * This function should accept following params:
   *
   * @param message A [message object](https://getstream.io/chat/docs/#message_format) which is flagged.
   *
   * */
  getFlagMessageErrorNotification: PropTypes.func,

  /**
   * Function that returns message/text as string to be shown as notification, when request for muting a user is successful
   *
   * This function should accept following params:
   *
   * @param user A user object which is being muted
   *
   * */
  getMuteUserSuccessNotification: PropTypes.func,

  /**
   * Function that returns message/text as string to be shown as notification, when request for muting a user runs into error
   *
   * This function should accept following params:
   *
   * @param user A user object which is being muted
   *
   * */
  getMuteUserErrorNotification: PropTypes.func,

  /**
   * Function that returns message/text as string to be shown as notification, when request for pinning a message runs into error
   *
   * This function should accept following params:
   *
   * @param message A [message object](https://getstream.io/chat/docs/#message_format)
   *
   * */
  getPinMessageErrorNotification: PropTypes.func,

  /** Latest message id on current channel */
  lastReceivedId: PropTypes.string,

  /** DOMRect object for parent MessageList component */
  messageListRect:
  /** @type {PropTypes.Validator<DOMRect>} */
  PropTypes.object,

  /** @see See [Channel Context](https://getstream.github.io/stream-chat-react/#channelcontext) */
  members:
  /** @type {PropTypes.Validator<{[user_id: string]: import('stream-chat').ChannelMemberResponse<import('../types').StreamChatReactUserType>} | null | undefined>} */
  PropTypes.object,

  /**
   * Function to add custom notification on message list
   *
   * @param text Notification text to display
   * @param type Type of notification. 'success' | 'error'
   * */
  addNotification: PropTypes.func,

  /** @see See [Channel Context](https://getstream.github.io/stream-chat-react/#channelcontext) */
  updateMessage: PropTypes.func,

  /** @see See [Channel Context](https://getstream.github.io/stream-chat-react/#channelcontext) */
  removeMessage: PropTypes.func,

  /** @see See [Channel Context](https://getstream.github.io/stream-chat-react/#channelcontext) */
  retrySendMessage: PropTypes.func,

  /** @see See [Channel Context](https://getstream.github.io/stream-chat-react/#channelcontext) */
  onMentionsClick: PropTypes.func,

  /** @see See [Channel Context](https://getstream.github.io/stream-chat-react/#channelcontext) */
  onMentionsHover: PropTypes.func,

  /**
   * The handler for click event on the user that posted the message
   *
   * @param event Dom click event which triggered handler.
   * @param user the User object for the corresponding user.
   */
  onUserClick: PropTypes.func,

  /**
   * The handler for hover events on the user that posted the message
   *
   * @param event Dom hover event which triggered handler.
   * @param user the User object for the corresponding user.
   */
  onUserHover: PropTypes.func,

  /** @see See [Channel Context](https://getstream.github.io/stream-chat-react/#channelcontext) */
  openThread: PropTypes.func,

  /**
   * Additional props for underlying MessageInput component.
   * Available props - https://getstream.github.io/stream-chat-react/#messageinput
   * */
  additionalMessageInputProps: PropTypes.object,

  /**
   * The user roles allowed to pin messages in various channel types
   */
  pinPermissions:
  /** @type {PropTypes.Validator<import('../types').PinPermissions>>} */
  PropTypes.object
};
Message.defaultProps = {
  readBy: []
};
var Message$1 = /*#__PURE__*/React.memo(Message, areMessagePropsEqual);

/**
 * MessageCommerce - Render component, should be used together with the Message component
 *
 * @example ../../docs/MessageCommerce.md
 * @type { React.FC<import('../types').MessageCommerceProps> }
 */

var MessageCommerce = function MessageCommerce(props) {
  var _message$user, _message$user2, _message$user3, _message$user4, _message$user5;

  var message = props.message,
      formatDate = props.formatDate,
      groupStyles = props.groupStyles,
      actionsEnabled = props.actionsEnabled,
      threadList = props.threadList,
      MessageDeleted = props.MessageDeleted,
      getMessageActions = props.getMessageActions,
      _props$ReactionsList = props.ReactionsList,
      ReactionsList = _props$ReactionsList === void 0 ? DefaultReactionsList : _props$ReactionsList,
      _props$ReactionSelect = props.ReactionSelector,
      ReactionSelector = _props$ReactionSelect === void 0 ? DefaultReactionSelector : _props$ReactionSelect,
      propHandleReaction = props.handleReaction,
      propHandleAction = props.handleAction,
      propHandleOpenThread = props.handleOpenThread,
      propOnUserClick = props.onUserClick,
      propOnUserHover = props.onUserHover,
      propTDateTimeParser = props.tDateTimeParser;
  var Attachment$1 = props.Attachment || Attachment;
  var Avatar$1 = props.Avatar || Avatar;
  var hasReactions = messageHasReactions(message);
  var handleAction = useActionHandler(message);
  var handleReaction = useReactionHandler(message);
  var handleOpenThread = useOpenThreadHandler(message);
  var reactionSelectorRef = useRef(null);

  var _useReactionClick = useReactionClick(message, reactionSelectorRef),
      onReactionListClick = _useReactionClick.onReactionListClick,
      showDetailedReactions = _useReactionClick.showDetailedReactions,
      isReactionEnabled = _useReactionClick.isReactionEnabled;

  var _useUserHandler = useUserHandler(message, {
    onUserClickHandler: propOnUserClick,
    onUserHoverHandler: propOnUserHover
  }),
      onUserClick = _useUserHandler.onUserClick,
      onUserHover = _useUserHandler.onUserHover;

  var _useUserRole = useUserRole(message),
      isMyMessage = _useUserRole.isMyMessage;

  var messageClasses = "str-chat__message-commerce str-chat__message-commerce--".concat(isMyMessage ? 'right' : 'left');
  var hasAttachment = messageHasAttachments(message);
  var firstGroupStyle = groupStyles ? groupStyles[0] : '';

  if (message !== null && message !== void 0 && message.deleted_at) {
    return smartRender(MessageDeleted, props, null);
  }

  if (message && (message.type === 'message.read' || message.type === 'message.date')) {
    return null;
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    "data-testid": "message-commerce-wrapper",
    key: (message === null || message === void 0 ? void 0 : message.id) || '',
    className: "\n\t\t\t\t\t\t".concat(messageClasses, "\n\t\t\t\t\t\tstr-chat__message-commerce--").concat(message === null || message === void 0 ? void 0 : message.type, "\n\t\t\t\t\t\t").concat(message !== null && message !== void 0 && message.text ? 'str-chat__message-commerce--has-text' : 'str-chat__message-commerce--has-no-text', "\n\t\t\t\t\t\t").concat(hasAttachment ? 'str-chat__message-commerce--has-attachment' : '', "\n\t\t\t\t\t\t").concat(hasReactions && isReactionEnabled ? 'str-chat__message-commerce--with-reactions' : '', "\n            ", "str-chat__message-commerce--".concat(firstGroupStyle), "\n            ").concat(message !== null && message !== void 0 && message.pinned ? 'pinned-message' : '', "\n\t\t\t\t\t").trim()
  }, (firstGroupStyle === 'bottom' || firstGroupStyle === 'single') && /*#__PURE__*/React.createElement(Avatar$1, {
    image: message === null || message === void 0 ? void 0 : (_message$user = message.user) === null || _message$user === void 0 ? void 0 : _message$user.image,
    size: 32,
    name: (message === null || message === void 0 ? void 0 : (_message$user2 = message.user) === null || _message$user2 === void 0 ? void 0 : _message$user2.name) || (message === null || message === void 0 ? void 0 : (_message$user3 = message.user) === null || _message$user3 === void 0 ? void 0 : _message$user3.id),
    onClick: onUserClick,
    onMouseOver: onUserHover
  }), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__message-commerce-inner"
  }, message && !message.text && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MessageOptions, _extends({}, props, {
    displayLeft: false,
    displayReplies: false,
    displayActions: false,
    onReactionListClick: onReactionListClick,
    theme: 'commerce'
  })), hasReactions && !showDetailedReactions && isReactionEnabled && /*#__PURE__*/React.createElement(ReactionsList, {
    reactions: message.latest_reactions,
    reaction_counts: message.reaction_counts || undefined,
    own_reactions: message.own_reactions,
    onClick: onReactionListClick
  }), showDetailedReactions && isReactionEnabled && /*#__PURE__*/React.createElement(ReactionSelector, {
    reverse: false,
    handleReaction: propHandleReaction || handleReaction,
    detailedView: true,
    reaction_counts: message.reaction_counts || undefined,
    latest_reactions: message.latest_reactions,
    own_reactions: message.own_reactions,
    ref: reactionSelectorRef
  })), (message === null || message === void 0 ? void 0 : message.attachments) && Attachment$1 && /*#__PURE__*/React.createElement(Attachment$1, {
    attachments: message.attachments,
    actionHandler: propHandleAction || handleAction
  }), (message === null || message === void 0 ? void 0 : message.mml) && /*#__PURE__*/React.createElement(MML, {
    source: message.mml,
    actionHandler: handleAction,
    align: isMyMessage ? 'right' : 'left'
  }), (message === null || message === void 0 ? void 0 : message.text) && /*#__PURE__*/React.createElement(MessageText, {
    ReactionSelector: ReactionSelector,
    ReactionsList: ReactionsList,
    actionsEnabled: actionsEnabled,
    customWrapperClass: "str-chat__message-commerce-text",
    customInnerClass: "str-chat__message-commerce-text-inner",
    customOptionProps: {
      displayLeft: false,
      displayReplies: false,
      displayActions: false,
      theme: 'commerce'
    },
    getMessageActions: getMessageActions,
    message: message,
    messageListRect: props.messageListRect,
    unsafeHTML: props.unsafeHTML,
    onMentionsClickMessage: props.onMentionsClickMessage,
    onMentionsHoverMessage: props.onMentionsHoverMessage,
    theme: "commerce"
  }), !threadList && /*#__PURE__*/React.createElement("div", {
    className: "str-chat__message-commerce-reply-button"
  }, /*#__PURE__*/React.createElement(MessageRepliesCountButton$1, {
    onClick: propHandleOpenThread || handleOpenThread,
    reply_count: message === null || message === void 0 ? void 0 : message.reply_count
  })), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__message-commerce-data"
  }, !isMyMessage ? /*#__PURE__*/React.createElement("span", {
    className: "str-chat__message-commerce-name"
  }, (message === null || message === void 0 ? void 0 : (_message$user4 = message.user) === null || _message$user4 === void 0 ? void 0 : _message$user4.name) || (message === null || message === void 0 ? void 0 : (_message$user5 = message.user) === null || _message$user5 === void 0 ? void 0 : _message$user5.id)) : null, /*#__PURE__*/React.createElement(MessageTimestamp$1, {
    formatDate: formatDate,
    customClass: "str-chat__message-commerce-timestamp",
    message: message,
    tDateTimeParser: propTDateTimeParser,
    format: "LT"
  })))));
};

MessageCommerce.propTypes = {
  /** The [message object](https://getstream.io/chat/docs/#message_format) */
  message:
  /** @type {PropTypes.Validator<import('stream-chat').MessageResponse>} */
  PropTypes.object.isRequired,

  /**
   * The attachment UI component.
   * Default: [Attachment](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment.js)
   * */
  Attachment:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').WrapperAttachmentUIComponentProps>>} */
  PropTypes.elementType,

  /**
   * Custom UI component to display user avatar
   *
   * Defaults to and accepts same props as: [Avatar](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Avatar/Avatar.js)
   * */
  Avatar:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').AvatarProps>>} */
  PropTypes.elementType,

  /**
   *
   * @deprecated Its not recommended to use this anymore. All the methods in this HOC are provided explicitly.
   *
   * The higher order message component, most logic is delegated to this component
   * @see See [Message HOC](https://getstream.github.io/stream-chat-react/#message) for example
   *
   */
  Message:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').MessageUIComponentProps>>} */
  PropTypes.oneOfType([PropTypes.node, PropTypes.func, PropTypes.object]),

  /** render HTML instead of markdown. Posting HTML is only allowed server-side */
  unsafeHTML: PropTypes.bool,

  /** If its parent message in thread. */
  initialMessage: PropTypes.bool,

  /** Channel config object */
  channelConfig:
  /** @type {PropTypes.Validator<import('stream-chat').ChannelConfig>} */
  PropTypes.object,

  /** Override the default formatting of the date. This is a function that has access to the original date object. Returns a string or Node  */
  formatDate: PropTypes.func,

  /** If component is in thread list */
  threadList: PropTypes.bool,

  /**
   * Function to open thread on current message
   * @deprecated The component now relies on the useThreadHandler custom hook
   * You can customize the behaviour for your thread handler on the <Channel> component instead.
   */
  handleOpenThread: PropTypes.func,

  /** Returns true if message belongs to current user */
  isMyMessage: PropTypes.func,

  /** Returns all allowed actions on message by current user e.g., ['edit', 'delete', 'flag', 'mute', 'react', 'reply'] */
  getMessageActions: PropTypes.func.isRequired,

  /**
   * Add or remove reaction on message
   *
   * @param type Type of reaction - 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry'
   * @param event Dom event which triggered this function
   * @deprecated This component now relies on the useReactionHandler custom hook.
   */
  handleReaction: PropTypes.func,

  /**
   * A component to display the selector that allows a user to react to a certain message.
   */
  ReactionSelector:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').ReactionSelectorProps>>} */
  PropTypes.elementType,

  /**
   * A component to display the a message list of reactions.
   */
  ReactionsList:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').ReactionsListProps>>} */
  PropTypes.elementType,

  /** If actions such as edit, delete, flag, mute are enabled on message */
  actionsEnabled: PropTypes.bool,

  /**
   * @param name {string} Name of action
   * @param value {string} Value of action
   * @param event Dom event that triggered this handler
   * @deprecated This component now relies on the useActionHandler custom hook, and this prop will be removed on the next major release.
   */
  handleAction: PropTypes.func,

  /**
   * The handler for hover event on @mention in message
   *
   * @param event Dom hover event which triggered handler.
   * @param user Target user object
   */
  onMentionsHoverMessage: PropTypes.func,

  /**
   * The handler for click event on @mention in message
   *
   * @param event Dom click event which triggered handler.
   * @param user Target user object
   */
  onMentionsClickMessage: PropTypes.func,

  /** Position of message in group. Possible values: top, bottom, middle, single */
  groupStyles: PropTypes.array,

  /**
   * The handler for click event on the user that posted the message
   *
   * @param event Dom click event which triggered handler.
   * @deprecated This component now relies on the useUserHandler custom hook, and this prop will be removed on the next major release.
   */
  onUserClick: PropTypes.func,

  /**
   * The handler for mouseOver event on the user that posted the message
   *
   * @param event Dom mouseOver event which triggered handler.
   * @deprecated This component now relies on the useUserHandler custom hook, and this prop will be removed on the next major release.
   */
  onUserHover: PropTypes.func,

  /** The component that will be rendered if the message has been deleted.
   * All of Message's props are passed into this component.
   */
  MessageDeleted:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').MessageDeletedProps>>} */
  PropTypes.elementType
};
var MessageCommerce$1 = /*#__PURE__*/React.memo(MessageCommerce, areMessagePropsEqual);

/**
 * MessageLivestream - Render component, should be used together with the Message component
 * Implements the look and feel for a livestream use case.
 *
 * @example ../../docs/MessageLivestream.md
 * @typedef { import('../../../types').MessageLivestreamProps } Props
 * @type { React.FC<Props> }
 */

var MessageLivestreamComponent = function MessageLivestreamComponent(props) {
  var _message$i18n, _message$user4, _message$user5, _message$user6, _message$user7, _message$user8;

  var message = props.message,
      groupStyles = props.groupStyles,
      propEditing = props.editing,
      propSetEdit = props.setEditingState,
      propClearEdit = props.clearEditingState,
      initialMessage = props.initialMessage,
      unsafeHTML = props.unsafeHTML,
      formatDate = props.formatDate,
      propChannelConfig = props.channelConfig,
      _props$ReactionsList = props.ReactionsList,
      ReactionsList = _props$ReactionsList === void 0 ? DefaultReactionsList$1 : _props$ReactionsList,
      _props$ReactionSelect = props.ReactionSelector,
      ReactionSelector = _props$ReactionSelect === void 0 ? DefaultReactionSelector : _props$ReactionSelect,
      propOnUserClick = props.onUserClick,
      propHandleReaction = props.handleReaction,
      propHandleOpenThread = props.handleOpenThread,
      propOnUserHover = props.onUserHover,
      propHandleRetry = props.handleRetry,
      propHandleAction = props.handleAction,
      propUpdateMessage = props.updateMessage,
      propOnMentionsClick = props.onMentionsClickMessage,
      propOnMentionsHover = props.onMentionsHoverMessage,
      _props$Attachment = props.Attachment,
      Attachment$1 = _props$Attachment === void 0 ? Attachment : _props$Attachment,
      _props$Avatar = props.Avatar,
      Avatar$1 = _props$Avatar === void 0 ? Avatar : _props$Avatar,
      _props$EditMessageInp = props.EditMessageInput,
      EditMessageInput = _props$EditMessageInp === void 0 ? EditMessageForm : _props$EditMessageInp,
      propT = props.t,
      propTDateTimeParser = props.tDateTimeParser,
      MessageDeleted = props.MessageDeleted,
      _props$PinIndicator = props.PinIndicator,
      PinIndicator$1 = _props$PinIndicator === void 0 ? PinIndicator : _props$PinIndicator;

  var _useContext = useContext(TranslationContext),
      contextT = _useContext.t,
      userLanguage = _useContext.userLanguage;

  var t = propT || contextT;
  var messageWrapperRef = useRef(null);
  var reactionSelectorRef = useRef(null);
  /**
   *@type {import('../types').ChannelContextValue}
   */

  var _useContext2 = useContext(ChannelContext),
      channelUpdateMessage = _useContext2.updateMessage,
      channel = _useContext2.channel;

  var channelConfig = propChannelConfig || (channel === null || channel === void 0 ? void 0 : channel.getConfig());

  var _useMentionsUIHandler = useMentionsUIHandler(message, {
    onMentionsClick: propOnMentionsClick,
    onMentionsHover: propOnMentionsHover
  }),
      onMentionsClick = _useMentionsUIHandler.onMentionsClick,
      onMentionsHover = _useMentionsUIHandler.onMentionsHover;

  var handleAction = useActionHandler(message);
  var handleReaction = useReactionHandler(message);
  var handleOpenThread = useOpenThreadHandler(message);

  var _useEditHandler = useEditHandler(),
      ownEditing = _useEditHandler.editing,
      ownSetEditing = _useEditHandler.setEdit,
      ownClearEditing = _useEditHandler.clearEdit;

  var editing = propEditing || ownEditing;
  var setEdit = propSetEdit || ownSetEditing;
  var clearEdit = propClearEdit || ownClearEditing;
  var handleRetry = useRetryHandler();
  var retryHandler = propHandleRetry || handleRetry;

  var _useReactionClick = useReactionClick(message, reactionSelectorRef, messageWrapperRef),
      onReactionListClick = _useReactionClick.onReactionListClick,
      showDetailedReactions = _useReactionClick.showDetailedReactions,
      isReactionEnabled = _useReactionClick.isReactionEnabled;

  var _useUserHandler = useUserHandler(message, {
    onUserClickHandler: propOnUserClick,
    onUserHoverHandler: propOnUserHover
  }),
      onUserClick = _useUserHandler.onUserClick,
      onUserHover = _useUserHandler.onUserHover;

  var messageTextToRender = (message === null || message === void 0 ? void 0 : (_message$i18n = message.i18n) === null || _message$i18n === void 0 ? void 0 : _message$i18n["".concat(userLanguage, "_text")]) || (message === null || message === void 0 ? void 0 : message.text);
  var messageMentionedUsersItem = message === null || message === void 0 ? void 0 : message.mentioned_users;
  var messageText = useMemo(function () {
    return renderText(messageTextToRender, messageMentionedUsersItem);
  }, [messageMentionedUsersItem, messageTextToRender]);
  var firstGroupStyle = groupStyles ? groupStyles[0] : '';

  if (!message || message.type === 'message.read' || message.type === 'message.date') {
    return null;
  }

  if (message.deleted_at) {
    return smartRender(MessageDeleted, props, null);
  }

  if (editing) {
    var _message$user, _message$user2, _message$user3;

    return /*#__PURE__*/React.createElement("div", {
      "data-testid": 'message-livestream-edit',
      className: "str-chat__message-team str-chat__message-team--".concat(firstGroupStyle, " str-chat__message-team--editing")
    }, (firstGroupStyle === 'top' || firstGroupStyle === 'single') && /*#__PURE__*/React.createElement("div", {
      className: "str-chat__message-team-meta"
    }, /*#__PURE__*/React.createElement(Avatar$1, {
      image: (_message$user = message.user) === null || _message$user === void 0 ? void 0 : _message$user.image,
      name: ((_message$user2 = message.user) === null || _message$user2 === void 0 ? void 0 : _message$user2.name) || ((_message$user3 = message.user) === null || _message$user3 === void 0 ? void 0 : _message$user3.id),
      size: 40,
      onClick: onUserClick,
      onMouseOver: onUserHover
    })), /*#__PURE__*/React.createElement(MessageInput$1, {
      Input: EditMessageInput,
      message: message,
      clearEditingState: clearEdit,
      updateMessage: propUpdateMessage || channelUpdateMessage
    }));
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, (message === null || message === void 0 ? void 0 : message.pinned) && /*#__PURE__*/React.createElement("div", {
    className: "str-chat__message-livestream-pin-indicator"
  }, /*#__PURE__*/React.createElement(PinIndicator$1, {
    message: message,
    t: t
  })), /*#__PURE__*/React.createElement("div", {
    "data-testid": "message-livestream",
    className: "str-chat__message-livestream str-chat__message-livestream--".concat(firstGroupStyle, " str-chat__message-livestream--").concat(message.type, " str-chat__message-livestream--").concat(message.status, " ").concat(initialMessage ? 'str-chat__message-livestream--initial-message' : '', " ").concat(message !== null && message !== void 0 && message.pinned ? 'pinned-message' : ''),
    ref: messageWrapperRef
  }, showDetailedReactions && isReactionEnabled && /*#__PURE__*/React.createElement(ReactionSelector, {
    reverse: false,
    handleReaction: handleReaction,
    detailedView: true,
    latest_reactions: message === null || message === void 0 ? void 0 : message.latest_reactions,
    reaction_counts: (message === null || message === void 0 ? void 0 : message.reaction_counts) || undefined,
    own_reactions: message.own_reactions,
    ref: reactionSelectorRef
  }), /*#__PURE__*/React.createElement(MessageLivestreamActions, {
    initialMessage: initialMessage,
    message: message,
    formatDate: formatDate,
    onReactionListClick: onReactionListClick,
    messageWrapperRef: messageWrapperRef,
    getMessageActions: props.getMessageActions,
    tDateTimeParser: propTDateTimeParser,
    channelConfig: channelConfig,
    threadList: props.threadList,
    addNotification: props.addNotification,
    handleOpenThread: propHandleOpenThread || handleOpenThread,
    setEditingState: setEdit
  }), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__message-livestream-left"
  }, /*#__PURE__*/React.createElement(Avatar$1, {
    image: (_message$user4 = message.user) === null || _message$user4 === void 0 ? void 0 : _message$user4.image,
    name: ((_message$user5 = message.user) === null || _message$user5 === void 0 ? void 0 : _message$user5.name) || (message === null || message === void 0 ? void 0 : (_message$user6 = message.user) === null || _message$user6 === void 0 ? void 0 : _message$user6.id),
    size: 30,
    onClick: onUserClick,
    onMouseOver: onUserHover
  })), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__message-livestream-right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__message-livestream-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__message-livestream-author"
  }, /*#__PURE__*/React.createElement("strong", null, ((_message$user7 = message.user) === null || _message$user7 === void 0 ? void 0 : _message$user7.name) || ((_message$user8 = message.user) === null || _message$user8 === void 0 ? void 0 : _message$user8.id)), (message === null || message === void 0 ? void 0 : message.type) === 'error' && /*#__PURE__*/React.createElement("div", {
    className: "str-chat__message-team-error-header"
  }, t('Only visible to you'))), /*#__PURE__*/React.createElement("div", {
    "data-testid": "message-livestream-text",
    className: isOnlyEmojis(message.text) ? 'str-chat__message-livestream-text--is-emoji' : '',
    onMouseOver: onMentionsHover,
    onClick: onMentionsClick
  }, message.type !== 'error' && message.status !== 'failed' && !unsafeHTML && messageText, message.type !== 'error' && message.status !== 'failed' && unsafeHTML && !!message.html && /*#__PURE__*/React.createElement("div", {
    dangerouslySetInnerHTML: {
      __html: message.html
    }
  }), message.type === 'error' && !message.command && /*#__PURE__*/React.createElement("p", {
    "data-testid": "message-livestream-error"
  }, /*#__PURE__*/React.createElement(ErrorIcon, null), message.text), message.type === 'error' && message.command && /*#__PURE__*/React.createElement("p", {
    "data-testid": "message-livestream-command-error"
  }, /*#__PURE__*/React.createElement(ErrorIcon, null), /*#__PURE__*/React.createElement("strong", null, "/", message.command), " is not a valid command"), message.status === 'failed' && /*#__PURE__*/React.createElement("p", {
    onClick: function onClick() {
      if (retryHandler) {
        // FIXME: type checking fails here because in the case of a failed message,
        // `message` is of type Client.Message (i.e. request object)
        // instead of Client.MessageResponse (i.e. server response object)
        // @ts-expect-error
        retryHandler(message);
      }
    }
  }, /*#__PURE__*/React.createElement(ErrorIcon, null), t('Message failed. Click to try again.'))), (message === null || message === void 0 ? void 0 : message.attachments) && Attachment$1 && /*#__PURE__*/React.createElement(Attachment$1, {
    attachments: message.attachments,
    actionHandler: propHandleAction || handleAction
  }), isReactionEnabled && /*#__PURE__*/React.createElement(ReactionsList, {
    reaction_counts: message.reaction_counts || undefined,
    reactions: message.latest_reactions,
    own_reactions: message.own_reactions,
    handleReaction: propHandleReaction || handleReaction
  }), !initialMessage && /*#__PURE__*/React.createElement(MessageRepliesCountButton$1, {
    onClick: propHandleOpenThread || handleOpenThread,
    reply_count: message.reply_count
  })))));
};
/**
 * @type { React.FC<import('../types').MessageLivestreamActionProps> }
 */


var MessageLivestreamActions = function MessageLivestreamActions(props) {
  var initialMessage = props.initialMessage,
      message = props.message,
      channelConfig = props.channelConfig,
      threadList = props.threadList,
      formatDate = props.formatDate,
      messageWrapperRef = props.messageWrapperRef,
      onReactionListClick = props.onReactionListClick,
      getMessageActions = props.getMessageActions,
      handleOpenThread = props.handleOpenThread,
      propTDateTimeParser = props.tDateTimeParser;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      actionsBoxOpen = _useState2[0],
      setActionsBoxOpen = _useState2[1];
  /** @type {() => void} Typescript syntax */


  var hideOptions = useCallback(function () {
    return setActionsBoxOpen(false);
  }, []);
  var messageDeletedAt = !!(message !== null && message !== void 0 && message.deleted_at);
  var messageWrapper = messageWrapperRef === null || messageWrapperRef === void 0 ? void 0 : messageWrapperRef.current;
  useEffect(function () {
    if (messageWrapper) {
      messageWrapper.addEventListener('mouseleave', hideOptions);
    }

    return function () {
      if (messageWrapper) {
        messageWrapper.removeEventListener('mouseleave', hideOptions);
      }
    };
  }, [messageWrapper, hideOptions]);
  useEffect(function () {
    if (messageDeletedAt) {
      document.removeEventListener('click', hideOptions);
    }
  }, [messageDeletedAt, hideOptions]);
  useEffect(function () {
    if (actionsBoxOpen) {
      document.addEventListener('click', hideOptions);
    } else {
      document.removeEventListener('click', hideOptions);
    }

    return function () {
      document.removeEventListener('click', hideOptions);
    };
  }, [actionsBoxOpen, hideOptions]);

  if (initialMessage || !message || message.type === 'error' || message.type === 'system' || message.type === 'ephemeral' || message.status === 'failed' || message.status === 'sending') {
    return null;
  }

  return /*#__PURE__*/React.createElement("div", {
    "data-testid": 'message-livestream-actions',
    className: "str-chat__message-livestream-actions"
  }, /*#__PURE__*/React.createElement(MessageTimestamp$1, {
    customClass: "str-chat__message-livestream-time",
    message: message,
    formatDate: formatDate,
    tDateTimeParser: propTDateTimeParser
  }), channelConfig && channelConfig.reactions && /*#__PURE__*/React.createElement("span", {
    onClick: onReactionListClick,
    "data-testid": "message-livestream-reactions-action"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(ReactionIcon, null))), !threadList && channelConfig && channelConfig.replies && /*#__PURE__*/React.createElement("span", {
    "data-testid": "message-livestream-thread-action",
    onClick: handleOpenThread
  }, /*#__PURE__*/React.createElement(ThreadIcon, null)), /*#__PURE__*/React.createElement(MessageActions, _extends({}, props, {
    getMessageActions: getMessageActions,
    customWrapperClass: '',
    inline: true
  })));
};

MessageLivestreamComponent.propTypes = {
  /** The [message object](https://getstream.io/chat/docs/#message_format) */
  message:
  /** @type {PropTypes.Validator<import('stream-chat').MessageResponse>} */
  PropTypes.object.isRequired,

  /**
   * The attachment UI component.
   * Default: [Attachment](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment.js)
   * */
  Attachment:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').WrapperAttachmentUIComponentProps>>} */
  PropTypes.elementType,

  /**
   * Custom UI component to display user avatar
   *
   * Defaults to and accepts same props as: [Avatar](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Avatar/Avatar.js)
   * */
  Avatar:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').AvatarProps>>} */
  PropTypes.elementType,

  /**
   * Custom UI component to override default edit message input
   *
   * Defaults to and accepts same props as: [EditMessageForm](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/EditMessageForm.js)
   * */
  EditMessageInput:
  /** @type {PropTypes.Validator<React.FC<import("types").MessageInputProps>>} */
  PropTypes.elementType,

  /**
   * Custom UI component to override default pinned message indicator
   *
   * Defaults to and accepts same props as: [PinIndicator](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/icon.js)
   * */
  PinIndicator:
  /** @type {PropTypes.Validator<React.FC<import("types").PinIndicatorProps>>} */
  PropTypes.elementType,

  /**
   *
   * @deprecated Its not recommended to use this anymore. All the methods in this HOC are provided explicitly.
   *
   * The higher order message component, most logic is delegated to this component
   * @see See [Message HOC](https://getstream.github.io/stream-chat-react/#message) for example
   *
   * */
  Message:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').MessageUIComponentProps>>} */
  PropTypes.oneOfType([PropTypes.node, PropTypes.func, PropTypes.object]),

  /** render HTML instead of markdown. Posting HTML is only allowed server-side */
  unsafeHTML: PropTypes.bool,

  /** If its parent message in thread. */
  initialMessage: PropTypes.bool,

  /** Override the default formatting of the date. This is a function that has access to the original date object. Returns a string or Node  */
  formatDate: PropTypes.func,

  /** Channel config object */
  channelConfig:
  /** @type {PropTypes.Validator<import('stream-chat').ChannelConfig>} */
  PropTypes.object,

  /** If component is in thread list */
  threadList: PropTypes.bool,

  /** Function to open thread on current message */
  handleOpenThread: PropTypes.func,

  /** If the message is in edit state */
  editing: PropTypes.bool,

  /** Function to exit edit state */
  clearEditingState: PropTypes.func,

  /** Returns true if message belongs to current user */
  isMyMessage: PropTypes.func,

  /**
   * Returns all allowed actions on message by current user e.g., ['edit', 'delete', 'flag', 'mute', 'react', 'reply']
   * Please check [Message](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message.js) component for default implementation.
   * */
  getMessageActions:
  /** @type {PropTypes.Validator<() => Array<string>>} */
  PropTypes.func,

  /**
   * Function to publish updates on message to channel
   *
   * @param message Updated [message object](https://getstream.io/chat/docs/#message_format)
   * */
  updateMessage: PropTypes.func,

  /**
   * Reattempt sending a message
   * @param message A [message object](https://getstream.io/chat/docs/#message_format) to resent.
   */
  handleRetry: PropTypes.func,

  /**
   * Add or remove reaction on message
   *
   * @param type Type of reaction - 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry'
   * @param event Dom event which triggered this function
   */
  handleReaction: PropTypes.func,

  /**
   * A component to display the selector that allows a user to react to a certain message.
   */
  ReactionSelector:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').ReactionSelectorProps>>} */
  PropTypes.elementType,

  /**
   * A component to display the a message list of reactions.
   */
  ReactionsList:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').ReactionsListProps>>} */
  PropTypes.elementType,

  /** If actions such as edit, delete, flag, mute are enabled on message */

  /** @deprecated This property is no longer used * */
  actionsEnabled: PropTypes.bool,

  /** DOMRect object for parent MessageList component */
  messageListRect: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
    bottom: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    toJSON: PropTypes.func.isRequired
  }),

  /**
   * @param name {string} Name of action
   * @param value {string} Value of action
   * @param event Dom event that triggered this handler
   */
  handleAction: PropTypes.func,

  /**
   * The handler for hover event on @mention in message
   *
   * @param event Dom hover event which triggered handler.
   * @param user Target user object
   */
  onMentionsHoverMessage: PropTypes.func,

  /**
   * The handler for click event on @mention in message
   *
   * @param event Dom click event which triggered handler.
   * @param user Target user object
   */
  onMentionsClickMessage: PropTypes.func,

  /**
   * The handler for click event on the user that posted the message
   *
   * @param event Dom click event which triggered handler.
   */
  onUserClick: PropTypes.func,

  /**
   * The handler for mouseOver event on the user that posted the message
   *
   * @param event Dom mouseOver event which triggered handler.
   */
  onUserHover: PropTypes.func,

  /**
   * The component that will be rendered if the message has been deleted.
   * All of Message's props are passed into this component.
   */
  MessageDeleted:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').MessageDeletedProps>>} */
  PropTypes.elementType
};
var MessageLivestream = /*#__PURE__*/React.memo(MessageLivestreamComponent, areMessagePropsEqual);

/**
 * MessageTeam - Render component, should be used together with the Message component
 * Implements the look and feel for a team style collaboration environment
 *
 * @example ../../docs/MessageTeam.md
 * @typedef { import('../types').MessageTeamProps } Props
 *
 * @type {React.FC<Props>}
 */

var MessageTeam = function MessageTeam(props) {
  var _message$i18n, _message$user4, _message$user5, _message$user6, _message$user7, _message$user8;

  var message = props.message,
      threadList = props.threadList,
      formatDate = props.formatDate,
      initialMessage = props.initialMessage,
      unsafeHTML = props.unsafeHTML,
      getMessageActions = props.getMessageActions,
      _props$Avatar = props.Avatar,
      Avatar$1 = _props$Avatar === void 0 ? Avatar : _props$Avatar,
      _props$EditMessageInp = props.EditMessageInput,
      EditMessageInput = _props$EditMessageInp === void 0 ? EditMessageForm : _props$EditMessageInp,
      MessageDeleted = props.MessageDeleted,
      _props$PinIndicator = props.PinIndicator,
      PinIndicator$1 = _props$PinIndicator === void 0 ? PinIndicator : _props$PinIndicator,
      _props$ReactionsList = props.ReactionsList,
      ReactionsList = _props$ReactionsList === void 0 ? DefaultReactionsList$1 : _props$ReactionsList,
      _props$ReactionSelect = props.ReactionSelector,
      ReactionSelector = _props$ReactionSelect === void 0 ? DefaultReactionSelector : _props$ReactionSelect,
      propEditing = props.editing,
      propSetEdit = props.setEditingState,
      propClearEdit = props.clearEditingState,
      propOnMentionsHover = props.onMentionsHoverMessage,
      propOnMentionsClick = props.onMentionsClickMessage,
      propChannelConfig = props.channelConfig,
      propHandleAction = props.handleAction,
      propHandleOpenThread = props.handleOpenThread,
      propHandleReaction = props.handleReaction,
      propHandleRetry = props.handleRetry,
      propUpdateMessage = props.updateMessage,
      propOnUserClick = props.onUserClick,
      propOnUserHover = props.onUserHover,
      propT = props.t;
  /**
   *@type {import('../types').ChannelContextValue}
   */

  var _useContext = useContext(ChannelContext),
      channel = _useContext.channel,
      channelUpdateMessage = _useContext.updateMessage;

  var channelConfig = propChannelConfig || (channel === null || channel === void 0 ? void 0 : channel.getConfig());

  var _useContext2 = useContext(TranslationContext),
      contextT = _useContext2.t,
      userLanguage = _useContext2.userLanguage;

  var t = propT || contextT;
  var groupStyles = props.groupStyles || ['single'];
  var reactionSelectorRef = useRef(null);
  var messageWrapperRef = useRef(null);

  var _useEditHandler = useEditHandler(),
      ownEditing = _useEditHandler.editing,
      ownSetEditing = _useEditHandler.setEdit,
      ownClearEditing = _useEditHandler.clearEdit;

  var editing = propEditing || ownEditing;
  var setEdit = propSetEdit || ownSetEditing;
  var clearEdit = propClearEdit || ownClearEditing;
  var handleOpenThread = useOpenThreadHandler(message);
  var handleReaction = useReactionHandler(message);
  var handleAction = useActionHandler(message);
  var retryHandler = useRetryHandler();
  var retry = propHandleRetry || retryHandler;

  var _useMentionsUIHandler = useMentionsUIHandler(message, {
    onMentionsClick: propOnMentionsClick,
    onMentionsHover: propOnMentionsHover
  }),
      onMentionsClick = _useMentionsUIHandler.onMentionsClick,
      onMentionsHover = _useMentionsUIHandler.onMentionsHover;

  var _useReactionClick = useReactionClick(message, reactionSelectorRef, messageWrapperRef),
      onReactionListClick = _useReactionClick.onReactionListClick,
      showDetailedReactions = _useReactionClick.showDetailedReactions,
      isReactionEnabled = _useReactionClick.isReactionEnabled;

  var _useUserHandler = useUserHandler(message, {
    onUserClickHandler: propOnUserClick,
    onUserHoverHandler: propOnUserHover
  }),
      onUserClick = _useUserHandler.onUserClick,
      onUserHover = _useUserHandler.onUserHover;

  var messageTextToRender = (message === null || message === void 0 ? void 0 : (_message$i18n = message.i18n) === null || _message$i18n === void 0 ? void 0 : _message$i18n["".concat(userLanguage, "_text")]) || (message === null || message === void 0 ? void 0 : message.text);
  var messageMentionedUsersItem = message === null || message === void 0 ? void 0 : message.mentioned_users; // eslint-disable-next-line react-hooks/rules-of-hooks

  var messageText = useMemo(function () {
    return renderText(messageTextToRender, messageMentionedUsersItem);
  }, [messageMentionedUsersItem, messageTextToRender]);
  var firstGroupStyle = groupStyles ? groupStyles[0] : '';

  if ((message === null || message === void 0 ? void 0 : message.type) === 'message.read') {
    return null;
  }

  if (message !== null && message !== void 0 && message.deleted_at) {
    return smartRender(MessageDeleted, props, null);
  }

  if (editing) {
    var _message$user, _message$user2, _message$user3;

    return /*#__PURE__*/React.createElement("div", {
      "data-testid": "message-team-edit",
      className: "str-chat__message-team str-chat__message-team--".concat(firstGroupStyle, " str-chat__message-team--editing")
    }, (firstGroupStyle === 'top' || firstGroupStyle === 'single') && /*#__PURE__*/React.createElement("div", {
      className: "str-chat__message-team-meta"
    }, /*#__PURE__*/React.createElement(Avatar$1, {
      image: message === null || message === void 0 ? void 0 : (_message$user = message.user) === null || _message$user === void 0 ? void 0 : _message$user.image,
      name: (message === null || message === void 0 ? void 0 : (_message$user2 = message.user) === null || _message$user2 === void 0 ? void 0 : _message$user2.name) || (message === null || message === void 0 ? void 0 : (_message$user3 = message.user) === null || _message$user3 === void 0 ? void 0 : _message$user3.id),
      size: 40,
      onClick: onUserClick,
      onMouseOver: onUserHover
    })), /*#__PURE__*/React.createElement(MessageInput$1, {
      Input: EditMessageInput,
      message: message,
      clearEditingState: clearEdit,
      updateMessage: propUpdateMessage || channelUpdateMessage
    }));
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, (message === null || message === void 0 ? void 0 : message.pinned) && /*#__PURE__*/React.createElement("div", {
    className: "str-chat__message-team-pin-indicator"
  }, /*#__PURE__*/React.createElement(PinIndicator$1, {
    message: message,
    t: t
  })), /*#__PURE__*/React.createElement("div", {
    "data-testid": "message-team",
    className: "str-chat__message-team str-chat__message-team--".concat(firstGroupStyle, " str-chat__message-team--").concat(message === null || message === void 0 ? void 0 : message.type, " ").concat(threadList ? 'thread-list' : '', " str-chat__message-team--").concat(message === null || message === void 0 ? void 0 : message.status, " ").concat(message !== null && message !== void 0 && message.pinned ? 'pinned-message' : ''),
    ref: messageWrapperRef
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__message-team-meta"
  }, firstGroupStyle === 'top' || firstGroupStyle === 'single' || initialMessage ? /*#__PURE__*/React.createElement(Avatar$1, {
    image: message === null || message === void 0 ? void 0 : (_message$user4 = message.user) === null || _message$user4 === void 0 ? void 0 : _message$user4.image,
    name: (message === null || message === void 0 ? void 0 : (_message$user5 = message.user) === null || _message$user5 === void 0 ? void 0 : _message$user5.name) || (message === null || message === void 0 ? void 0 : (_message$user6 = message.user) === null || _message$user6 === void 0 ? void 0 : _message$user6.id),
    size: 40,
    onClick: onUserClick,
    onMouseOver: onUserHover
  }) : /*#__PURE__*/React.createElement("div", {
    "data-testid": "team-meta-spacer",
    style: {
      width: 40,
      marginRight: 0
    }
  }), /*#__PURE__*/React.createElement(MessageTimestamp$1, {
    message: message,
    tDateTimeParser: props.tDateTimeParser,
    formatDate: formatDate
  })), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__message-team-group"
  }, message && (firstGroupStyle === 'top' || firstGroupStyle === 'single' || initialMessage) && /*#__PURE__*/React.createElement("div", {
    "data-testid": "message-team-author",
    className: "str-chat__message-team-author",
    onClick: onUserClick
  }, /*#__PURE__*/React.createElement("strong", null, ((_message$user7 = message.user) === null || _message$user7 === void 0 ? void 0 : _message$user7.name) || ((_message$user8 = message.user) === null || _message$user8 === void 0 ? void 0 : _message$user8.id)), message.type === 'error' && /*#__PURE__*/React.createElement("div", {
    className: "str-chat__message-team-error-header"
  }, t('Only visible to you'))), /*#__PURE__*/React.createElement("div", {
    "data-testid": "message-team-content",
    className: "str-chat__message-team-content str-chat__message-team-content--".concat(firstGroupStyle, " str-chat__message-team-content--").concat((message === null || message === void 0 ? void 0 : message.text) === '' ? 'image' : 'text')
  }, !initialMessage && message && message.status !== 'sending' && message.status !== 'failed' && message.type !== 'system' && message.type !== 'ephemeral' && message.type !== 'error' && /*#__PURE__*/React.createElement("div", {
    "data-testid": "message-team-actions",
    className: "str-chat__message-team-actions"
  }, message && showDetailedReactions && /*#__PURE__*/React.createElement(ReactionSelector, {
    handleReaction: propHandleReaction || handleReaction,
    latest_reactions: message.latest_reactions,
    reaction_counts: message.reaction_counts || undefined,
    own_reactions: message.own_reactions,
    detailedView: true,
    ref: reactionSelectorRef
  }), isReactionEnabled && /*#__PURE__*/React.createElement("span", {
    "data-testid": "message-team-reaction-icon",
    title: "Reactions",
    onClick: onReactionListClick
  }, /*#__PURE__*/React.createElement(ReactionIcon, null)), !threadList && (channelConfig === null || channelConfig === void 0 ? void 0 : channelConfig.replies) !== false && /*#__PURE__*/React.createElement("span", {
    "data-testid": "message-team-thread-icon",
    title: "Start a thread",
    onClick: propHandleOpenThread || handleOpenThread
  }, /*#__PURE__*/React.createElement(ThreadIcon, null)), message && getMessageActions && getMessageActions().length > 0 && /*#__PURE__*/React.createElement(MessageActions, {
    addNotification: props.addNotification,
    message: message,
    getMessageActions: props.getMessageActions,
    messageListRect: props.messageListRect,
    messageWrapperRef: messageWrapperRef,
    setEditingState: setEdit,
    getMuteUserSuccessNotification: props.getMuteUserSuccessNotification,
    getMuteUserErrorNotification: props.getMuteUserErrorNotification,
    getFlagMessageErrorNotification: props.getFlagMessageErrorNotification,
    getFlagMessageSuccessNotification: props.getFlagMessageSuccessNotification,
    handleFlag: props.handleFlag,
    handleMute: props.handleMute,
    handleEdit: props.handleEdit,
    handleDelete: props.handleDelete,
    handlePin: props.handlePin,
    customWrapperClass: '',
    inline: true
  })), message && /*#__PURE__*/React.createElement("span", {
    "data-testid": "message-team-message",
    className: isOnlyEmojis(message.text) ? 'str-chat__message-team-text--is-emoji' : '',
    onMouseOver: onMentionsHover,
    onClick: onMentionsClick
  }, unsafeHTML && message.html ? /*#__PURE__*/React.createElement("div", {
    dangerouslySetInnerHTML: {
      __html: message.html
    }
  }) : messageText), (message === null || message === void 0 ? void 0 : message.mml) && /*#__PURE__*/React.createElement(MML, {
    source: message.mml,
    actionHandler: handleAction,
    align: "left"
  }), message && message.text === '' && /*#__PURE__*/React.createElement(MessageTeamAttachments, {
    Attachment: props.Attachment,
    message: message,
    handleAction: propHandleAction || handleAction
  }), (message === null || message === void 0 ? void 0 : message.latest_reactions) && message.latest_reactions.length !== 0 && message.text !== '' && isReactionEnabled && /*#__PURE__*/React.createElement(ReactionsList, {
    reaction_counts: message.reaction_counts || undefined,
    handleReaction: propHandleReaction || handleReaction,
    reactions: message.latest_reactions,
    own_reactions: message.own_reactions
  }), (message === null || message === void 0 ? void 0 : message.status) === 'failed' && /*#__PURE__*/React.createElement("button", {
    "data-testid": "message-team-failed",
    className: "str-chat__message-team-failed",
    onClick: function onClick() {
      if (message.status === 'failed' && retry) {
        // FIXME: type checking fails here because in the case of a failed message,
        // `message` is of type Client.Message (i.e. request object)
        // instead of Client.MessageResponse (i.e. server response object)
        // @ts-expect-error
        retry(message);
      }
    }
  }, /*#__PURE__*/React.createElement(ErrorIcon, null), t('Message failed. Click to try again.'))), /*#__PURE__*/React.createElement(MessageTeamStatus, {
    Avatar: Avatar$1,
    readBy: props.readBy,
    message: message,
    threadList: threadList,
    lastReceivedId: props.lastReceivedId,
    t: propT
  }), message && message.text !== '' && message.attachments && /*#__PURE__*/React.createElement(MessageTeamAttachments, {
    Attachment: props.Attachment,
    message: message,
    handleAction: propHandleAction || handleAction
  }), (message === null || message === void 0 ? void 0 : message.latest_reactions) && message.latest_reactions.length !== 0 && message.text === '' && isReactionEnabled && /*#__PURE__*/React.createElement(ReactionsList, {
    reaction_counts: message.reaction_counts || undefined,
    handleReaction: propHandleReaction || handleReaction,
    reactions: message.latest_reactions,
    own_reactions: message.own_reactions
  }), !threadList && message && /*#__PURE__*/React.createElement(MessageRepliesCountButton$1, {
    onClick: propHandleOpenThread || handleOpenThread,
    reply_count: message.reply_count
  }))));
};
/** @type {(props: import('../types').MessageTeamStatusProps) => React.ReactElement | null} */


var MessageTeamStatus = function MessageTeamStatus(props) {
  var _props$Avatar2 = props.Avatar,
      Avatar$1 = _props$Avatar2 === void 0 ? Avatar : _props$Avatar2,
      readBy = props.readBy,
      message = props.message,
      threadList = props.threadList,
      lastReceivedId = props.lastReceivedId,
      propT = props.t;

  var _useContext3 = useContext(ChannelContext),
      client = _useContext3.client;

  var _useContext4 = useContext(TranslationContext),
      contextT = _useContext4.t;

  var t = propT || contextT;

  var _useUserRole = useUserRole(message),
      isMyMessage = _useUserRole.isMyMessage;

  if (!isMyMessage || (message === null || message === void 0 ? void 0 : message.type) === 'error') {
    return null;
  }

  var justReadByMe = readBy && (client === null || client === void 0 ? void 0 : client.user) && readBy.length === 1 && readBy[0] && readBy[0].id === client.user.id;

  if (message && message.status === 'sending') {
    return /*#__PURE__*/React.createElement("span", {
      className: "str-chat__message-team-status",
      "data-testid": "message-team-sending"
    }, /*#__PURE__*/React.createElement(Tooltip$1, null, t && t('Sending...')), /*#__PURE__*/React.createElement(DefaultLoadingIndicator, null));
  }

  if (readBy && readBy.length !== 0 && !threadList && !justReadByMe) {
    var lastReadUser = readBy.filter(function (item) {
      return item && (client === null || client === void 0 ? void 0 : client.user) && item.id !== client.user.id;
    })[0];
    return /*#__PURE__*/React.createElement("span", {
      className: "str-chat__message-team-status"
    }, /*#__PURE__*/React.createElement(Tooltip$1, null, getReadByTooltipText(readBy, t, client)), /*#__PURE__*/React.createElement(Avatar$1, {
      name: lastReadUser === null || lastReadUser === void 0 ? void 0 : lastReadUser.name,
      image: lastReadUser === null || lastReadUser === void 0 ? void 0 : lastReadUser.image,
      size: 15
    }), readBy.length - 1 > 1 && /*#__PURE__*/React.createElement("span", {
      "data-testid": "message-team-read-by-count",
      className: "str-chat__message-team-status-number"
    }, readBy.length - 1));
  }

  if (message && message.status === 'received' && message.id === lastReceivedId && !threadList) {
    return /*#__PURE__*/React.createElement("span", {
      "data-testid": "message-team-received",
      className: "str-chat__message-team-status"
    }, /*#__PURE__*/React.createElement(Tooltip$1, null, t && t('Delivered')), /*#__PURE__*/React.createElement(DeliveredCheckIcon, null));
  }

  return null;
};
/** @type {(props: import('../types').MessageTeamAttachmentsProps) => React.ReactElement | null} Typescript syntax */


var MessageTeamAttachments = function MessageTeamAttachments(props) {
  var _props$Attachment = props.Attachment,
      Attachment$1 = _props$Attachment === void 0 ? Attachment : _props$Attachment,
      message = props.message,
      handleAction = props.handleAction;

  if (message !== null && message !== void 0 && message.attachments && Attachment$1) {
    return /*#__PURE__*/React.createElement(Attachment$1, {
      attachments: message.attachments,
      actionHandler: handleAction
    });
  }

  return null;
};

MessageTeam.propTypes = {
  /** The [message object](https://getstream.io/chat/docs/#message_format) */
  message:
  /** @type {PropTypes.Validator<import('stream-chat').MessageResponse>} */
  PropTypes.object.isRequired,

  /**
   * The attachment UI component.
   * Default: [Attachment](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment.js)
   * */
  Attachment:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').WrapperAttachmentUIComponentProps>>} */
  PropTypes.elementType,

  /**
   * Custom UI component to display user avatar
   *
   * Defaults to and accepts same props as: [Avatar](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Avatar/Avatar.js)
   * */
  Avatar:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').AvatarProps>>} */
  PropTypes.elementType,

  /**
   * Custom UI component to override default edit message input
   *
   * Defaults to and accepts same props as: [EditMessageForm](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/EditMessageForm.js)
   * */
  EditMessageInput:
  /** @type {PropTypes.Validator<React.FC<import("types").MessageInputProps>>} */
  PropTypes.elementType,

  /**
   * Custom UI component to override default pinned message indicator
   *
   * Defaults to and accepts same props as: [PinIndicator](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/icon.js)
   * */
  PinIndicator:
  /** @type {PropTypes.Validator<React.FC<import("types").PinIndicatorProps>>} */
  PropTypes.elementType,

  /**
   *
   * @deprecated Its not recommended to use this anymore. All the methods in this HOC are provided explicitly.
   *
   * The higher order message component, most logic is delegated to this component
   * @see See [Message HOC](https://getstream.github.io/stream-chat-react/#message) for example
   * */
  Message:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').MessageUIComponentProps>>} */
  PropTypes.oneOfType([PropTypes.node, PropTypes.func, PropTypes.object]),

  /** render HTML instead of markdown. Posting HTML is only allowed server-side */
  unsafeHTML: PropTypes.bool,

  /** Client object */
  client:
  /** @type {PropTypes.Validator<import('stream-chat').StreamChat>} */
  PropTypes.object,

  /** If its parent message in thread. */
  initialMessage: PropTypes.bool,

  /** Channel config object */
  channelConfig:
  /** @type {PropTypes.Validator<import('stream-chat').ChannelConfig>} */
  PropTypes.object,

  /** If component is in thread list */
  threadList: PropTypes.bool,

  /** Function to open thread on current message */
  handleOpenThread: PropTypes.func,

  /** If the message is in edit state */
  editing: PropTypes.bool,

  /** Function to exit edit state */
  clearEditingState: PropTypes.func,

  /** Returns true if message belongs to current user */
  isMyMessage: PropTypes.func,

  /** Override the default formatting of the date. This is a function that has access to the original date object. Returns a string or Node  */
  formatDate: PropTypes.func,

  /**
   * Returns all allowed actions on message by current user e.g., ['edit', 'delete', 'flag', 'mute', 'react', 'reply']
   * Please check [Message](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message.js) component for default implementation.
   * */
  getMessageActions:
  /** @type {PropTypes.Validator<() => Array<string>>} */
  PropTypes.func,

  /**
   * Function to publish updates on message to channel
   *
   * @param message Updated [message object](https://getstream.io/chat/docs/#message_format)
   * */
  updateMessage: PropTypes.func,

  /**
   * Reattempt sending a message
   * @param message A [message object](https://getstream.io/chat/docs/#message_format) to resent.
   */
  handleRetry: PropTypes.func,

  /**
   * Add or remove reaction on message
   *
   * @param type Type of reaction - 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry'
   * @param event Dom event which triggered this function
   */
  handleReaction: PropTypes.func,

  /**
   * A component to display the selector that allows a user to react to a certain message.
   */
  ReactionSelector:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').ReactionSelectorProps>>} */
  PropTypes.elementType,

  /**
   * A component to display the a message list of reactions.
   */
  ReactionsList:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').ReactionsListProps>>} */
  PropTypes.elementType,

  /** DOMRect object for parent MessageList component */
  messageListRect:
  /** @type {PropTypes.Validator<DOMRect>} */
  PropTypes.object,

  /**
   * @param name {string} Name of action
   * @param value {string} Value of action
   * @param event Dom event that triggered this handler
   */
  handleAction: PropTypes.func,

  /**
   * Handler for pinning a current message
   *
   * @param event React's MouseEventHandler event
   * @returns void
   * */
  handlePin: PropTypes.func,

  /**
   * The handler for hover event on @mention in message
   *
   * @param event Dom hover event which triggered handler.
   * @param user Target user object
   */
  onMentionsHoverMessage: PropTypes.func,

  /**
   * The handler for click event on @mention in message
   *
   * @param event Dom click event which triggered handler.
   * @param user Target user object
   */
  onMentionsClickMessage: PropTypes.func,

  /**
   * The handler for click event on the user that posted the message
   *
   * @param event Dom click event which triggered handler.
   */
  onUserClick: PropTypes.func,

  /**
   * The handler for mouseOver event on the user that posted the message
   *
   * @param event Dom mouseOver event which triggered handler.
   */
  onUserHover: PropTypes.func,

  /** Position of message in group. Possible values: top, bottom, middle, single */
  groupStyles: PropTypes.array,

  /**
   * The component that will be rendered if the message has been deleted.
   * All of Message's props are passed into this component.
   */
  MessageDeleted:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').MessageDeletedProps>>} */
  PropTypes.elementType
};
var MessageTeam$1 = /*#__PURE__*/React.memo(MessageTeam, areMessagePropsEqual);

// @ts-check
/**
 * @param { number } number
 * @param { boolean } dark
 */

var selectColor = function selectColor(number, dark) {
  var hue = number * 137.508; // use golden angle approximation

  return "hsl(".concat(hue, ",").concat(dark ? '50%' : '85%', ", ").concat(dark ? '75%' : '55%', ")");
};
/**
 * @param { string } userId
 */


var hashUserId = function hashUserId(userId) {
  var hash = userId.split('').reduce(function (acc, c) {
    acc = (acc << 5) - acc + c.charCodeAt(0); // eslint-disable-line

    return acc & acc; // eslint-disable-line no-bitwise
  }, 0);
  return Math.abs(hash) / Math.pow(10, Math.ceil(Math.log10(Math.abs(hash) + 1)));
};
/**
 * @param { string } theme
 * @param { string } userId
 */


var getUserColor = function getUserColor(theme, userId) {
  return selectColor(hashUserId(userId), theme.includes('dark'));
};
/**
 * FixedHeightMessage - This component renders a single message.
 * It uses fixed height elements to make sure it works well in VirtualizedMessageList
 * @type {React.FC<import('../types').FixedHeightMessageProps>}
 */


var FixedHeightMessage = function FixedHeightMessage(_ref) {
  var _message$i18n, _message$user, _message$attachments, _message$user2, _message$user3, _message$user4, _message$user5;

  var message = _ref.message,
      groupedByUser = _ref.groupedByUser;

  var _useContext = useContext(ChatContext),
      theme = _useContext.theme;

  var _useContext2 = useContext(TranslationContext),
      userLanguage = _useContext2.userLanguage;

  var role = useUserRole(message);
  var handleAction = useActionHandler(message);
  var messageTextToRender = // @ts-expect-error
  (message === null || message === void 0 ? void 0 : (_message$i18n = message.i18n) === null || _message$i18n === void 0 ? void 0 : _message$i18n["".concat(userLanguage, "_text")]) || (message === null || message === void 0 ? void 0 : message.text);
  var renderedText = useMemo(function () {
    return renderText(messageTextToRender, message.mentioned_users);
  }, [message.mentioned_users, messageTextToRender]);
  var userId = (_message$user = message.user) === null || _message$user === void 0 ? void 0 : _message$user.id; // @ts-expect-error

  var userColor = useMemo(function () {
    return getUserColor(theme, userId);
  }, [userId, theme]);
  var messageActionsHandler = useCallback(function () {
    return getMessageActions(['delete'], {
      canDelete: role.canDeleteMessage
    });
  }, [role]);
  var images = message === null || message === void 0 ? void 0 : (_message$attachments = message.attachments) === null || _message$attachments === void 0 ? void 0 : _message$attachments.filter(function (_ref2) {
    var type = _ref2.type;
    return type === 'image';
  });
  return /*#__PURE__*/React.createElement("div", {
    key: message.id,
    className: "str-chat__virtual-message__wrapper ".concat(role.isMyMessage ? 'str-chat__virtual-message__wrapper--me' : '', " ").concat(groupedByUser ? 'str-chat__virtual-message__wrapper--group' : '')
  }, /*#__PURE__*/React.createElement(Avatar, {
    shape: "rounded",
    size: 38 // @ts-expect-error
    ,
    image: (_message$user2 = message.user) === null || _message$user2 === void 0 ? void 0 : _message$user2.image,
    name: ((_message$user3 = message.user) === null || _message$user3 === void 0 ? void 0 : _message$user3.name) || ((_message$user4 = message.user) === null || _message$user4 === void 0 ? void 0 : _message$user4.id)
  }), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__virtual-message__content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__virtual-message__meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__virtual-message__author",
    style: {
      color: userColor
    }
  }, /*#__PURE__*/React.createElement("strong", null, ((_message$user5 = message.user) === null || _message$user5 === void 0 ? void 0 : _message$user5.name) || 'unknown'))), images && /*#__PURE__*/React.createElement(Gallery$1, {
    images: images
  }), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__virtual-message__text",
    "data-testid": "msg-text"
  }, renderedText, message.mml && /*#__PURE__*/React.createElement(MML, {
    source: message.mml,
    actionHandler: handleAction,
    align: "left"
  }), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__virtual-message__data"
  }, /*#__PURE__*/React.createElement(MessageActions, {
    message: message,
    customWrapperClass: "str-chat__virtual-message__actions",
    getMessageActions: messageActionsHandler
  }), /*#__PURE__*/React.createElement("span", {
    className: "str-chat__virtual-message__date"
  }, /*#__PURE__*/React.createElement(MessageTimestamp$1, {
    customClass: "str-chat__message-simple-timestamp",
    message: message
  }))))));
};

var DefaultMessage = /*#__PURE__*/React.memo(FixedHeightMessage);

function ownKeys$6(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$6(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$6(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$6(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/** @type {import('./types').ChannelStateReducer} */
var channelReducer = function channelReducer(state, action) {
  switch (action.type) {
    case 'initStateFromChannel':
      {
        var channel = action.channel;
        return _objectSpread$6(_objectSpread$6({}, state), {}, {
          messages: _toConsumableArray(channel.state.messages),
          pinnedMessages: _toConsumableArray(channel.state.pinnedMessages),
          read: _objectSpread$6({}, channel.state.read),
          watchers: _objectSpread$6({}, channel.state.watchers),
          members: _objectSpread$6({}, channel.state.members),
          watcherCount: channel.state.watcher_count,
          loading: false
        });
      }

    case 'copyStateFromChannelOnEvent':
      {
        var _channel = action.channel;
        return _objectSpread$6(_objectSpread$6({}, state), {}, {
          messages: _toConsumableArray(_channel.state.messages),
          pinnedMessages: _toConsumableArray(_channel.state.pinnedMessages),
          read: _objectSpread$6({}, _channel.state.read),
          watchers: _objectSpread$6({}, _channel.state.watchers),
          members: _objectSpread$6({}, _channel.state.members),
          typing: _objectSpread$6({}, _channel.state.typing),
          watcherCount: _channel.state.watcher_count
        });
      }

    case 'setThread':
      {
        var message = action.message;
        return _objectSpread$6(_objectSpread$6({}, state), {}, {
          thread: message
        });
      }

    case 'loadMoreFinished':
      {
        var hasMore = action.hasMore,
            messages = action.messages;
        return _objectSpread$6(_objectSpread$6({}, state), {}, {
          loadingMore: false,
          hasMore,
          messages
        });
      }

    case 'setLoadingMore':
      {
        var loadingMore = action.loadingMore;
        return _objectSpread$6(_objectSpread$6({}, state), {}, {
          loadingMore
        });
      }

    case 'copyMessagesFromChannel':
      {
        var _channel2 = action.channel,
            parentId = action.parentId;
        return _objectSpread$6(_objectSpread$6({}, state), {}, {
          messages: _toConsumableArray(_channel2.state.messages),
          pinnedMessages: _toConsumableArray(_channel2.state.pinnedMessages),
          threadMessages: parentId ? _objectSpread$6({}, _channel2.state.threads)[parentId] || [] : state.threadMessages
        });
      }

    case 'updateThreadOnEvent':
      {
        var _state$thread;

        var _channel3 = action.channel,
            _message = action.message;
        if (!state.thread) return state;
        return _objectSpread$6(_objectSpread$6({}, state), {}, {
          threadMessages: (_state$thread = state.thread) !== null && _state$thread !== void 0 && _state$thread.id ? _objectSpread$6({}, _channel3.state.threads)[state.thread.id] || [] : [],
          thread: (_message === null || _message === void 0 ? void 0 : _message.id) === state.thread.id ? _channel3.state.formatMessage(_message) : state.thread
        });
      }

    case 'openThread':
      {
        var _message2 = action.message,
            _channel4 = action.channel;
        return _objectSpread$6(_objectSpread$6({}, state), {}, {
          thread: _message2,
          threadMessages: _message2.id ? _objectSpread$6({}, _channel4.state.threads)[_message2.id] || [] : []
        });
      }

    case 'startLoadingThread':
      {
        return _objectSpread$6(_objectSpread$6({}, state), {}, {
          threadLoadingMore: true
        });
      }

    case 'loadMoreThreadFinished':
      {
        var threadHasMore = action.threadHasMore,
            threadMessages = action.threadMessages;
        return _objectSpread$6(_objectSpread$6({}, state), {}, {
          threadHasMore,
          threadMessages,
          threadLoadingMore: false
        });
      }

    case 'closeThread':
      {
        return _objectSpread$6(_objectSpread$6({}, state), {}, {
          thread: null,
          threadMessages: [],
          threadLoadingMore: false
        });
      }

    case 'setError':
      {
        var error = action.error;
        return _objectSpread$6(_objectSpread$6({}, state), {}, {
          error
        });
      }

    default:
      return state;
  }
};
/** @type {import('./types').ChannelState} */

var initialState = {
  error: null,
  loading: true,
  loadingMore: false,
  hasMore: true,
  messages: [],
  pinnedMessages: [],
  typing: {},
  members: {},
  watchers: {},
  watcherCount: 0,
  read: {},
  thread: null,
  threadMessages: [],
  threadLoadingMore: false,
  threadHasMore: true
};

// @ts-check
/**
 * @type {import('../types').useMentionsHandlers}
 */

var useMentionsHandlers = function useMentionsHandlers(onMentionsHover, onMentionsClick) {
  return useCallback(function (e, mentioned_users) {
    if (!onMentionsHover && !onMentionsClick) return; // eslint-disable-next-line prefer-destructuring

    var target =
    /** @type {HTMLSpanElement} */
    e.target;
    var tagName = target === null || target === void 0 ? void 0 : target.tagName.toLowerCase();
    var textContent = target === null || target === void 0 ? void 0 : target.innerHTML.replace('*', '');

    if (tagName === 'strong' && textContent[0] === '@') {
      var userName = textContent.replace('@', '');
      var user = mentioned_users.find(function (_ref) {
        var name = _ref.name,
            id = _ref.id;
        return name === userName || id === userName;
      });

      if (onMentionsHover && typeof onMentionsHover === 'function' && e.type === 'mouseover') {
        onMentionsHover(e, user);
      }

      if (onMentionsClick && e.type === 'click' && typeof onMentionsClick === 'function') {
        onMentionsClick(e, user);
      }
    }
  }, [onMentionsClick, onMentionsHover]);
};

// @ts-check
/**
 * @type {import('../types').useEditMessageHandler}
 */

var useEditMessageHandler = function useEditMessageHandler(doUpdateMessageRequest) {
  var _useContext = useContext(ChatContext),
      channel = _useContext.channel,
      client = _useContext.client;

  return function (updatedMessage) {
    if (doUpdateMessageRequest && channel) {
      return Promise.resolve(doUpdateMessageRequest(channel.cid, updatedMessage));
    }

    return client.updateMessage(updatedMessage);
  };
};

var useIsMounted = (function () {
  var isMounted = useRef(true);
  useEffect(function () {
    return function () {
      isMounted.current = false;
    };
  }, []);
  return isMounted;
});

var compressed=true;var categories=[{id:"people",name:"Smileys & People",emojis:["grinning","smiley","smile","grin","laughing","sweat_smile","rolling_on_the_floor_laughing","joy","slightly_smiling_face","upside_down_face","wink","blush","innocent","smiling_face_with_3_hearts","heart_eyes","star-struck","kissing_heart","kissing","relaxed","kissing_closed_eyes","kissing_smiling_eyes","yum","stuck_out_tongue","stuck_out_tongue_winking_eye","zany_face","stuck_out_tongue_closed_eyes","money_mouth_face","hugging_face","face_with_hand_over_mouth","shushing_face","thinking_face","zipper_mouth_face","face_with_raised_eyebrow","neutral_face","expressionless","no_mouth","smirk","unamused","face_with_rolling_eyes","grimacing","lying_face","relieved","pensive","sleepy","drooling_face","sleeping","mask","face_with_thermometer","face_with_head_bandage","nauseated_face","face_vomiting","sneezing_face","hot_face","cold_face","woozy_face","dizzy_face","exploding_head","face_with_cowboy_hat","partying_face","sunglasses","nerd_face","face_with_monocle","confused","worried","slightly_frowning_face","white_frowning_face","open_mouth","hushed","astonished","flushed","pleading_face","frowning","anguished","fearful","cold_sweat","disappointed_relieved","cry","sob","scream","confounded","persevere","disappointed","sweat","weary","tired_face","yawning_face","triumph","rage","angry","face_with_symbols_on_mouth","smiling_imp","imp","skull","skull_and_crossbones","hankey","clown_face","japanese_ogre","japanese_goblin","ghost","alien","space_invader","robot_face","smiley_cat","smile_cat","joy_cat","heart_eyes_cat","smirk_cat","kissing_cat","scream_cat","crying_cat_face","pouting_cat","see_no_evil","hear_no_evil","speak_no_evil","wave","raised_back_of_hand","raised_hand_with_fingers_splayed","hand","spock-hand","ok_hand","pinching_hand","v","crossed_fingers","i_love_you_hand_sign","the_horns","call_me_hand","point_left","point_right","point_up_2","middle_finger","point_down","point_up","+1","-1","fist","facepunch","left-facing_fist","right-facing_fist","clap","raised_hands","open_hands","palms_up_together","handshake","pray","writing_hand","nail_care","selfie","muscle","mechanical_arm","mechanical_leg","leg","foot","ear","ear_with_hearing_aid","nose","brain","tooth","bone","eyes","eye","tongue","lips","baby","child","boy","girl","adult","man","bearded_person","red_haired_man","curly_haired_man","white_haired_man","bald_man","woman","red_haired_woman","curly_haired_woman","white_haired_woman","bald_woman","blond-haired-woman","blond-haired-man","older_adult","older_man","older_woman","man-frowning","woman-frowning","man-pouting","woman-pouting","man-gesturing-no","woman-gesturing-no","man-gesturing-ok","woman-gesturing-ok","man-tipping-hand","woman-tipping-hand","man-raising-hand","woman-raising-hand","deaf_person","deaf_man","deaf_woman","man-bowing","woman-bowing","man-facepalming","woman-facepalming","man-shrugging","woman-shrugging","male-doctor","female-doctor","male-student","female-student","male-teacher","female-teacher","male-judge","female-judge","male-farmer","female-farmer","male-cook","female-cook","male-mechanic","female-mechanic","male-factory-worker","female-factory-worker","male-office-worker","female-office-worker","male-scientist","female-scientist","male-technologist","female-technologist","male-singer","female-singer","male-artist","female-artist","male-pilot","female-pilot","male-astronaut","female-astronaut","male-firefighter","female-firefighter","male-police-officer","female-police-officer","male-guard","female-guard","male-construction-worker","female-construction-worker","prince","princess","man-wearing-turban","woman-wearing-turban","man_with_gua_pi_mao","person_with_headscarf","man_in_tuxedo","bride_with_veil","pregnant_woman","breast-feeding","angel","santa","mrs_claus","superhero","male_superhero","female_superhero","supervillain","male_supervillain","female_supervillain","mage","male_mage","female_mage","fairy","male_fairy","female_fairy","vampire","male_vampire","female_vampire","merperson","merman","mermaid","elf","male_elf","female_elf","genie","male_genie","female_genie","zombie","male_zombie","female_zombie","man-getting-massage","woman-getting-massage","man-getting-haircut","woman-getting-haircut","man-walking","woman-walking","standing_person","man_standing","woman_standing","kneeling_person","man_kneeling","woman_kneeling","man_with_probing_cane","woman_with_probing_cane","man_in_motorized_wheelchair","woman_in_motorized_wheelchair","man_in_manual_wheelchair","woman_in_manual_wheelchair","man-running","woman-running","dancer","man_dancing","man_in_business_suit_levitating","dancers","man-with-bunny-ears-partying","woman-with-bunny-ears-partying","person_in_steamy_room","man_in_steamy_room","woman_in_steamy_room","person_climbing","man_climbing","woman_climbing","fencer","horse_racing","skier","snowboarder","man-surfing","woman-surfing","man-rowing-boat","woman-rowing-boat","man-swimming","woman-swimming","man-biking","woman-biking","man-mountain-biking","woman-mountain-biking","man-cartwheeling","woman-cartwheeling","wrestlers","man-wrestling","woman-wrestling","man-playing-water-polo","woman-playing-water-polo","man-playing-handball","woman-playing-handball","juggling","man-juggling","woman-juggling","person_in_lotus_position","man_in_lotus_position","woman_in_lotus_position","bath","sleeping_accommodation","people_holding_hands","two_women_holding_hands","couple","two_men_holding_hands","couplekiss","woman-kiss-man","man-kiss-man","woman-kiss-woman","couple_with_heart","woman-heart-man","man-heart-man","woman-heart-woman","family","man-woman-boy","man-woman-girl","man-woman-girl-boy","man-woman-boy-boy","man-woman-girl-girl","man-man-boy","man-man-girl","man-man-girl-boy","man-man-boy-boy","man-man-girl-girl","woman-woman-boy","woman-woman-girl","woman-woman-girl-boy","woman-woman-boy-boy","woman-woman-girl-girl","man-boy","man-boy-boy","man-girl","man-girl-boy","man-girl-girl","woman-boy","woman-boy-boy","woman-girl","woman-girl-boy","woman-girl-girl","speaking_head_in_silhouette","bust_in_silhouette","busts_in_silhouette","footprints","kiss","love_letter","cupid","gift_heart","sparkling_heart","heartpulse","heartbeat","revolving_hearts","two_hearts","heart_decoration","heavy_heart_exclamation_mark_ornament","broken_heart","heart","orange_heart","yellow_heart","green_heart","blue_heart","purple_heart","brown_heart","black_heart","white_heart","100","anger","boom","dizzy","sweat_drops","dash","hole","bomb","speech_balloon","left_speech_bubble","right_anger_bubble","thought_balloon","zzz"]},{id:"nature",name:"Animals & Nature",emojis:["monkey_face","monkey","gorilla","orangutan","dog","dog2","guide_dog","service_dog","poodle","wolf","fox_face","raccoon","cat","cat2","lion_face","tiger","tiger2","leopard","horse","racehorse","unicorn_face","zebra_face","deer","cow","ox","water_buffalo","cow2","pig","pig2","boar","pig_nose","ram","sheep","goat","dromedary_camel","camel","llama","giraffe_face","elephant","rhinoceros","hippopotamus","mouse","mouse2","rat","hamster","rabbit","rabbit2","chipmunk","hedgehog","bat","bear","koala","panda_face","sloth","otter","skunk","kangaroo","badger","feet","turkey","chicken","rooster","hatching_chick","baby_chick","hatched_chick","bird","penguin","dove_of_peace","eagle","duck","swan","owl","flamingo","peacock","parrot","frog","crocodile","turtle","lizard","snake","dragon_face","dragon","sauropod","t-rex","whale","whale2","dolphin","fish","tropical_fish","blowfish","shark","octopus","shell","snail","butterfly","bug","ant","bee","beetle","cricket","spider","spider_web","scorpion","mosquito","microbe","bouquet","cherry_blossom","white_flower","rosette","rose","wilted_flower","hibiscus","sunflower","blossom","tulip","seedling","evergreen_tree","deciduous_tree","palm_tree","cactus","ear_of_rice","herb","shamrock","four_leaf_clover","maple_leaf","fallen_leaf","leaves"]},{id:"foods",name:"Food & Drink",emojis:["grapes","melon","watermelon","tangerine","lemon","banana","pineapple","mango","apple","green_apple","pear","peach","cherries","strawberry","kiwifruit","tomato","coconut","avocado","eggplant","potato","carrot","corn","hot_pepper","cucumber","leafy_green","broccoli","garlic","onion","mushroom","peanuts","chestnut","bread","croissant","baguette_bread","pretzel","bagel","pancakes","waffle","cheese_wedge","meat_on_bone","poultry_leg","cut_of_meat","bacon","hamburger","fries","pizza","hotdog","sandwich","taco","burrito","stuffed_flatbread","falafel","egg","fried_egg","shallow_pan_of_food","stew","bowl_with_spoon","green_salad","popcorn","butter","salt","canned_food","bento","rice_cracker","rice_ball","rice","curry","ramen","spaghetti","sweet_potato","oden","sushi","fried_shrimp","fish_cake","moon_cake","dango","dumpling","fortune_cookie","takeout_box","crab","lobster","shrimp","squid","oyster","icecream","shaved_ice","ice_cream","doughnut","cookie","birthday","cake","cupcake","pie","chocolate_bar","candy","lollipop","custard","honey_pot","baby_bottle","glass_of_milk","coffee","tea","sake","champagne","wine_glass","cocktail","tropical_drink","beer","beers","clinking_glasses","tumbler_glass","cup_with_straw","beverage_box","mate_drink","ice_cube","chopsticks","knife_fork_plate","fork_and_knife","spoon","hocho","amphora"]},{id:"activity",name:"Activities",emojis:["jack_o_lantern","christmas_tree","fireworks","sparkler","firecracker","sparkles","balloon","tada","confetti_ball","tanabata_tree","bamboo","dolls","flags","wind_chime","rice_scene","red_envelope","ribbon","gift","reminder_ribbon","admission_tickets","ticket","medal","trophy","sports_medal","first_place_medal","second_place_medal","third_place_medal","soccer","baseball","softball","basketball","volleyball","football","rugby_football","tennis","flying_disc","bowling","cricket_bat_and_ball","field_hockey_stick_and_ball","ice_hockey_stick_and_puck","lacrosse","table_tennis_paddle_and_ball","badminton_racquet_and_shuttlecock","boxing_glove","martial_arts_uniform","goal_net","golf","ice_skate","fishing_pole_and_fish","diving_mask","running_shirt_with_sash","ski","sled","curling_stone","dart","yo-yo","kite","8ball","crystal_ball","nazar_amulet","video_game","joystick","slot_machine","game_die","jigsaw","teddy_bear","spades","hearts","diamonds","clubs","chess_pawn","black_joker","mahjong","flower_playing_cards","performing_arts","frame_with_picture","art","thread","yarn"]},{id:"places",name:"Travel & Places",emojis:["earth_africa","earth_americas","earth_asia","globe_with_meridians","world_map","japan","compass","snow_capped_mountain","mountain","volcano","mount_fuji","camping","beach_with_umbrella","desert","desert_island","national_park","stadium","classical_building","building_construction","bricks","house_buildings","derelict_house_building","house","house_with_garden","office","post_office","european_post_office","hospital","bank","hotel","love_hotel","convenience_store","school","department_store","factory","japanese_castle","european_castle","wedding","tokyo_tower","statue_of_liberty","church","mosque","hindu_temple","synagogue","shinto_shrine","kaaba","fountain","tent","foggy","night_with_stars","cityscape","sunrise_over_mountains","sunrise","city_sunset","city_sunrise","bridge_at_night","hotsprings","carousel_horse","ferris_wheel","roller_coaster","barber","circus_tent","steam_locomotive","railway_car","bullettrain_side","bullettrain_front","train2","metro","light_rail","station","tram","monorail","mountain_railway","train","bus","oncoming_bus","trolleybus","minibus","ambulance","fire_engine","police_car","oncoming_police_car","taxi","oncoming_taxi","car","oncoming_automobile","blue_car","truck","articulated_lorry","tractor","racing_car","racing_motorcycle","motor_scooter","manual_wheelchair","motorized_wheelchair","auto_rickshaw","bike","scooter","skateboard","busstop","motorway","railway_track","oil_drum","fuelpump","rotating_light","traffic_light","vertical_traffic_light","octagonal_sign","construction","anchor","boat","canoe","speedboat","passenger_ship","ferry","motor_boat","ship","airplane","small_airplane","airplane_departure","airplane_arriving","parachute","seat","helicopter","suspension_railway","mountain_cableway","aerial_tramway","satellite","rocket","flying_saucer","bellhop_bell","luggage","hourglass","hourglass_flowing_sand","watch","alarm_clock","stopwatch","timer_clock","mantelpiece_clock","clock12","clock1230","clock1","clock130","clock2","clock230","clock3","clock330","clock4","clock430","clock5","clock530","clock6","clock630","clock7","clock730","clock8","clock830","clock9","clock930","clock10","clock1030","clock11","clock1130","new_moon","waxing_crescent_moon","first_quarter_moon","moon","full_moon","waning_gibbous_moon","last_quarter_moon","waning_crescent_moon","crescent_moon","new_moon_with_face","first_quarter_moon_with_face","last_quarter_moon_with_face","thermometer","sunny","full_moon_with_face","sun_with_face","ringed_planet","star","star2","stars","milky_way","cloud","partly_sunny","thunder_cloud_and_rain","mostly_sunny","barely_sunny","partly_sunny_rain","rain_cloud","snow_cloud","lightning","tornado","fog","wind_blowing_face","cyclone","rainbow","closed_umbrella","umbrella","umbrella_with_rain_drops","umbrella_on_ground","zap","snowflake","snowman","snowman_without_snow","comet","fire","droplet","ocean"]},{id:"objects",name:"Objects",emojis:["eyeglasses","dark_sunglasses","goggles","lab_coat","safety_vest","necktie","shirt","jeans","scarf","gloves","coat","socks","dress","kimono","sari","one-piece_swimsuit","briefs","shorts","bikini","womans_clothes","purse","handbag","pouch","shopping_bags","school_satchel","mans_shoe","athletic_shoe","hiking_boot","womans_flat_shoe","high_heel","sandal","ballet_shoes","boot","crown","womans_hat","tophat","mortar_board","billed_cap","helmet_with_white_cross","prayer_beads","lipstick","ring","gem","mute","speaker","sound","loud_sound","loudspeaker","mega","postal_horn","bell","no_bell","musical_score","musical_note","notes","studio_microphone","level_slider","control_knobs","microphone","headphones","radio","saxophone","guitar","musical_keyboard","trumpet","violin","banjo","drum_with_drumsticks","iphone","calling","phone","telephone_receiver","pager","fax","battery","electric_plug","computer","desktop_computer","printer","keyboard","three_button_mouse","trackball","minidisc","floppy_disk","cd","dvd","abacus","movie_camera","film_frames","film_projector","clapper","tv","camera","camera_with_flash","video_camera","vhs","mag","mag_right","candle","bulb","flashlight","izakaya_lantern","diya_lamp","notebook_with_decorative_cover","closed_book","book","green_book","blue_book","orange_book","books","notebook","ledger","page_with_curl","scroll","page_facing_up","newspaper","rolled_up_newspaper","bookmark_tabs","bookmark","label","moneybag","yen","dollar","euro","pound","money_with_wings","credit_card","receipt","chart","currency_exchange","heavy_dollar_sign","email","e-mail","incoming_envelope","envelope_with_arrow","outbox_tray","inbox_tray","package","mailbox","mailbox_closed","mailbox_with_mail","mailbox_with_no_mail","postbox","ballot_box_with_ballot","pencil2","black_nib","lower_left_fountain_pen","lower_left_ballpoint_pen","lower_left_paintbrush","lower_left_crayon","memo","briefcase","file_folder","open_file_folder","card_index_dividers","date","calendar","spiral_note_pad","spiral_calendar_pad","card_index","chart_with_upwards_trend","chart_with_downwards_trend","bar_chart","clipboard","pushpin","round_pushpin","paperclip","linked_paperclips","straight_ruler","triangular_ruler","scissors","card_file_box","file_cabinet","wastebasket","lock","unlock","lock_with_ink_pen","closed_lock_with_key","key","old_key","hammer","axe","pick","hammer_and_pick","hammer_and_wrench","dagger_knife","crossed_swords","gun","bow_and_arrow","shield","wrench","nut_and_bolt","gear","compression","scales","probing_cane","link","chains","toolbox","magnet","alembic","test_tube","petri_dish","dna","microscope","telescope","satellite_antenna","syringe","drop_of_blood","pill","adhesive_bandage","stethoscope","door","bed","couch_and_lamp","chair","toilet","shower","bathtub","razor","lotion_bottle","safety_pin","broom","basket","roll_of_paper","soap","sponge","fire_extinguisher","shopping_trolley","smoking","coffin","funeral_urn","moyai"]},{id:"symbols",name:"Symbols",emojis:["atm","put_litter_in_its_place","potable_water","wheelchair","mens","womens","restroom","baby_symbol","wc","passport_control","customs","baggage_claim","left_luggage","warning","children_crossing","no_entry","no_entry_sign","no_bicycles","no_smoking","do_not_litter","non-potable_water","no_pedestrians","no_mobile_phones","underage","radioactive_sign","biohazard_sign","arrow_up","arrow_upper_right","arrow_right","arrow_lower_right","arrow_down","arrow_lower_left","arrow_left","arrow_upper_left","arrow_up_down","left_right_arrow","leftwards_arrow_with_hook","arrow_right_hook","arrow_heading_up","arrow_heading_down","arrows_clockwise","arrows_counterclockwise","back","end","on","soon","top","place_of_worship","atom_symbol","om_symbol","star_of_david","wheel_of_dharma","yin_yang","latin_cross","orthodox_cross","star_and_crescent","peace_symbol","menorah_with_nine_branches","six_pointed_star","aries","taurus","gemini","cancer","leo","virgo","libra","scorpius","sagittarius","capricorn","aquarius","pisces","ophiuchus","twisted_rightwards_arrows","repeat","repeat_one","arrow_forward","fast_forward","black_right_pointing_double_triangle_with_vertical_bar","black_right_pointing_triangle_with_double_vertical_bar","arrow_backward","rewind","black_left_pointing_double_triangle_with_vertical_bar","arrow_up_small","arrow_double_up","arrow_down_small","arrow_double_down","double_vertical_bar","black_square_for_stop","black_circle_for_record","eject","cinema","low_brightness","high_brightness","signal_strength","vibration_mode","mobile_phone_off","female_sign","male_sign","medical_symbol","infinity","recycle","fleur_de_lis","trident","name_badge","beginner","o","white_check_mark","ballot_box_with_check","heavy_check_mark","heavy_multiplication_x","x","negative_squared_cross_mark","heavy_plus_sign","heavy_minus_sign","heavy_division_sign","curly_loop","loop","part_alternation_mark","eight_spoked_asterisk","eight_pointed_black_star","sparkle","bangbang","interrobang","question","grey_question","grey_exclamation","exclamation","wavy_dash","tm","keycap_ten","capital_abcd","abcd","1234","symbols","abc","a","ab","b","cl","cool","free","information_source","id","m","new","ng","o2","ok","parking","sos","up","vs","koko","sa","u6708","u6709","u6307","ideograph_advantage","u5272","u7121","u7981","accept","u7533","u5408","u7a7a","congratulations","secret","u55b6","u6e80","red_circle","large_orange_circle","large_yellow_circle","large_green_circle","large_blue_circle","large_purple_circle","large_brown_circle","black_circle","white_circle","large_red_square","large_orange_square","large_yellow_square","large_green_square","large_blue_square","large_purple_square","large_brown_square","black_large_square","white_large_square","black_medium_square","white_medium_square","black_medium_small_square","white_medium_small_square","black_small_square","white_small_square","large_orange_diamond","large_blue_diamond","small_orange_diamond","small_blue_diamond","small_red_triangle","small_red_triangle_down","diamond_shape_with_a_dot_inside","radio_button","white_square_button","black_square_button"]},{id:"flags",name:"Flags",emojis:["checkered_flag","cn","crossed_flags","de","es","flag-ac","flag-ad","flag-ae","flag-af","flag-ag","flag-ai","flag-al","flag-am","flag-ao","flag-aq","flag-ar","flag-as","flag-at","flag-au","flag-aw","flag-ax","flag-az","flag-ba","flag-bb","flag-bd","flag-be","flag-bf","flag-bg","flag-bh","flag-bi","flag-bj","flag-bl","flag-bm","flag-bn","flag-bo","flag-bq","flag-br","flag-bs","flag-bt","flag-bv","flag-bw","flag-by","flag-bz","flag-ca","flag-cc","flag-cd","flag-cf","flag-cg","flag-ch","flag-ci","flag-ck","flag-cl","flag-cm","flag-co","flag-cp","flag-cr","flag-cu","flag-cv","flag-cw","flag-cx","flag-cy","flag-cz","flag-dg","flag-dj","flag-dk","flag-dm","flag-do","flag-dz","flag-ea","flag-ec","flag-ee","flag-eg","flag-eh","flag-england","flag-er","flag-et","flag-eu","flag-fi","flag-fj","flag-fk","flag-fm","flag-fo","flag-ga","flag-gd","flag-ge","flag-gf","flag-gg","flag-gh","flag-gi","flag-gl","flag-gm","flag-gn","flag-gp","flag-gq","flag-gr","flag-gs","flag-gt","flag-gu","flag-gw","flag-gy","flag-hk","flag-hm","flag-hn","flag-hr","flag-ht","flag-hu","flag-ic","flag-id","flag-ie","flag-il","flag-im","flag-in","flag-io","flag-iq","flag-ir","flag-is","flag-je","flag-jm","flag-jo","flag-ke","flag-kg","flag-kh","flag-ki","flag-km","flag-kn","flag-kp","flag-kw","flag-ky","flag-kz","flag-la","flag-lb","flag-lc","flag-li","flag-lk","flag-lr","flag-ls","flag-lt","flag-lu","flag-lv","flag-ly","flag-ma","flag-mc","flag-md","flag-me","flag-mf","flag-mg","flag-mh","flag-mk","flag-ml","flag-mm","flag-mn","flag-mo","flag-mp","flag-mq","flag-mr","flag-ms","flag-mt","flag-mu","flag-mv","flag-mw","flag-mx","flag-my","flag-mz","flag-na","flag-nc","flag-ne","flag-nf","flag-ng","flag-ni","flag-nl","flag-no","flag-np","flag-nr","flag-nu","flag-nz","flag-om","flag-pa","flag-pe","flag-pf","flag-pg","flag-ph","flag-pk","flag-pl","flag-pm","flag-pn","flag-pr","flag-ps","flag-pt","flag-pw","flag-py","flag-qa","flag-re","flag-ro","flag-rs","flag-rw","flag-sa","flag-sb","flag-sc","flag-scotland","flag-sd","flag-se","flag-sg","flag-sh","flag-si","flag-sj","flag-sk","flag-sl","flag-sm","flag-sn","flag-so","flag-sr","flag-ss","flag-st","flag-sv","flag-sx","flag-sy","flag-sz","flag-ta","flag-tc","flag-td","flag-tf","flag-tg","flag-th","flag-tj","flag-tk","flag-tl","flag-tm","flag-tn","flag-to","flag-tr","flag-tt","flag-tv","flag-tw","flag-tz","flag-ua","flag-ug","flag-um","flag-uy","flag-uz","flag-va","flag-vc","flag-ve","flag-vg","flag-vi","flag-vn","flag-vu","flag-wales","flag-wf","flag-ws","flag-xk","flag-ye","flag-yt","flag-za","flag-zm","flag-zw","fr","gb","it","jp","kr","pirate_flag","rainbow-flag","ru","triangular_flag_on_post","us","waving_black_flag","waving_white_flag"]}];var emojis={"100":{a:"Hundred Points Symbol",b:"1F4AF",j:["score","perfect","numbers","century","exam","quiz","test","pass","hundred"],k:[26,5],o:2},"1234":{a:"Input Symbol for Numbers",b:"1F522",j:["numbers","blue-square"],k:[28,5],o:2},grinning:{a:"Grinning Face",b:"1F600",j:["face","smile","happy","joy",":D","grin"],k:[30,35],m:":D",o:2},monkey_face:{a:"Monkey Face",b:"1F435",j:["animal","nature","circus"],k:[12,25],l:[":o)"],o:2},grapes:{a:"Grapes",b:"1F347",j:["fruit","food","wine"],k:[6,31],o:2},eyeglasses:{a:"Eyeglasses",b:"1F453",j:["fashion","accessories","eyesight","nerdy","dork","geek"],k:[14,7],o:2},checkered_flag:{a:"Chequered Flag",b:"1F3C1",j:["contest","finishline","race","gokart"],k:[8,39],o:2},jack_o_lantern:{a:"Jack-O-Lantern",b:"1F383",j:["halloween","light","pumpkin","creepy","fall"],k:[7,34],o:2},wave:{a:"Waving Hand Sign",b:"1F44B",j:["hands","gesture","goodbye","solong","farewell","hello","hi","palm"],k:[13,26],o:2},earth_africa:{a:"Earth Globe Europe-Africa",b:"1F30D",j:["globe","world","international"],k:[5,32],o:2},atm:{a:"Automated Teller Machine",b:"1F3E7",j:["money","sales","cash","blue-square","payment","bank"],k:[11,1],o:2},melon:{a:"Melon",b:"1F348",j:["fruit","nature","food"],k:[6,32],o:2},triangular_flag_on_post:{a:"Triangular Flag on Post",b:"1F6A9",j:["mark","milestone","place"],k:[35,0],o:2},put_litter_in_its_place:{a:"Put Litter in Its Place Symbol",b:"1F6AE",j:["blue-square","sign","human","info"],k:[35,5],o:2},christmas_tree:{a:"Christmas Tree",b:"1F384",j:["festival","vacation","december","xmas","celebration"],k:[7,35],o:2},monkey:{a:"Monkey",b:"1F412",j:["animal","nature","banana","circus"],k:[11,46],o:2},earth_americas:{a:"Earth Globe Americas",b:"1F30E",j:["globe","world","USA","international"],k:[5,33],o:2},dark_sunglasses:{a:"Dark Sunglasses",b:"1F576-FE0F",c:"1F576",j:["face","cool","accessories"],k:[29,33],o:2},raised_back_of_hand:{a:"Raised Back of Hand",b:"1F91A",j:["fingers","raised","backhand"],k:[37,43],o:4},smiley:{a:"Smiling Face with Open Mouth",b:"1F603",j:["face","happy","joy","haha",":D",":)","smile","funny"],k:[30,38],l:["=)","=-)"],m:":)",o:2},earth_asia:{a:"Earth Globe Asia-Australia",b:"1F30F",j:["globe","world","east","international"],k:[5,34],o:2},crossed_flags:{a:"Crossed Flags",b:"1F38C",j:["japanese","nation","country","border"],k:[7,48],o:2},watermelon:{a:"Watermelon",b:"1F349",j:["fruit","food","picnic","summer"],k:[6,33],o:2},goggles:{a:"Goggles",b:"1F97D",k:[42,15],o:11},raised_hand_with_fingers_splayed:{a:"Raised Hand with Fingers Splayed",b:"1F590-FE0F",c:"1F590",j:["hand","fingers","palm"],k:[29,48],o:2},smile:{a:"Smiling Face with Open Mouth and Smiling Eyes",b:"1F604",j:["face","happy","joy","funny","haha","laugh","like",":D",":)"],k:[30,39],l:["C:","c:",":D",":-D"],m:":)",o:2},potable_water:{a:"Potable Water Symbol",b:"1F6B0",j:["blue-square","liquid","restroom","cleaning","faucet"],k:[35,7],o:2},fireworks:{a:"Fireworks",b:"1F386",j:["photo","festival","carnival","congratulations"],k:[7,42],o:2},gorilla:{a:"Gorilla",b:"1F98D",j:["animal","nature","circus"],k:[42,31],o:4},lab_coat:{a:"Lab Coat",b:"1F97C",k:[42,14],o:11},tangerine:{a:"Tangerine",b:"1F34A",j:["food","fruit","nature","orange"],k:[6,34],o:2},wheelchair:{a:"Wheelchair Symbol",b:"267F",j:["blue-square","disabled","a11y","accessibility"],k:[53,40],o:2},waving_black_flag:{a:"Waving Black Flag",b:"1F3F4",k:[11,17],o:2},orangutan:{a:"Orangutan",b:"1F9A7",k:[42,55],o:12},sparkler:{a:"Firework Sparkler",b:"1F387",j:["stars","night","shine"],k:[7,43],o:2},globe_with_meridians:{a:"Globe with Meridians",b:"1F310",j:["earth","international","world","internet","interweb","i18n"],k:[5,35],o:2},grin:{a:"Grinning Face with Smiling Eyes",b:"1F601",j:["face","happy","smile","joy","kawaii"],k:[30,36],o:2},hand:{a:"Raised Hand",b:"270B",k:[54,49],n:["raised_hand"],o:2},firecracker:{a:"Firecracker",b:"1F9E8",k:[51,27],o:11},lemon:{a:"Lemon",b:"1F34B",j:["fruit","nature"],k:[6,35],o:2},dog:{a:"Dog Face",b:"1F436",j:["animal","friend","nature","woof","puppy","pet","faithful"],k:[12,26],o:2},mens:{a:"Mens Symbol",b:"1F6B9",j:["toilet","restroom","wc","blue-square","gender","male"],k:[36,10],o:2},"spock-hand":{a:"Raised Hand with Part Between Middle and Ring Fingers",b:"1F596",k:[30,3],o:2},world_map:{a:"World Map",b:"1F5FA-FE0F",c:"1F5FA",j:["location","direction"],k:[30,29],o:2},laughing:{a:"Smiling Face with Open Mouth and Tightly-Closed Eyes",b:"1F606",j:["happy","joy","lol","satisfied","haha","face","glad","XD","laugh"],k:[30,41],l:[":>",":->"],n:["satisfied"],o:2},waving_white_flag:{a:"Waving White Flag",b:"1F3F3-FE0F",c:"1F3F3",k:[11,12],o:2},safety_vest:{a:"Safety Vest",b:"1F9BA",k:[43,54],o:12},sweat_smile:{a:"Smiling Face with Open Mouth and Cold Sweat",b:"1F605",j:["face","hot","happy","laugh","sweat","smile","relief"],k:[30,40],o:2},sparkles:{a:"Sparkles",b:"2728",j:["stars","shine","shiny","cool","awesome","good","magic"],k:[55,16],o:2},banana:{a:"Banana",b:"1F34C",j:["fruit","food","monkey"],k:[6,36],o:2},"rainbow-flag":{a:"Rainbow Flag",b:"1F3F3-FE0F-200D-1F308",c:"1F3F3-200D-1F308",k:[11,11],o:4},ok_hand:{a:"Ok Hand Sign",b:"1F44C",j:["fingers","limbs","perfect","ok","okay"],k:[13,32],o:2},japan:{a:"Silhouette of Japan",b:"1F5FE",j:["nation","country","japanese","asia"],k:[30,33],o:2},dog2:{a:"Dog",b:"1F415",j:["animal","nature","friend","doge","pet","faithful"],k:[11,50],o:2},womens:{a:"Womens Symbol",b:"1F6BA",j:["purple-square","woman","female","toilet","loo","restroom","gender"],k:[36,11],o:2},necktie:{a:"Necktie",b:"1F454",j:["shirt","suitup","formal","fashion","cloth","business"],k:[14,8],o:2},pirate_flag:{a:"Pirate Flag",b:"1F3F4-200D-2620-FE0F",c:"1F3F4-200D-2620",k:[11,13],o:11},guide_dog:{a:"Guide Dog",b:"1F9AE",k:[43,2],o:12},restroom:{a:"Restroom",b:"1F6BB",j:["blue-square","toilet","refresh","wc","gender"],k:[36,12],o:2},compass:{a:"Compass",b:"1F9ED",k:[51,32],o:11},rolling_on_the_floor_laughing:{a:"Rolling on the Floor Laughing",b:"1F923",k:[38,20],o:4},balloon:{a:"Balloon",b:"1F388",j:["party","celebration","birthday","circus"],k:[7,44],o:2},pinching_hand:{a:"Pinching Hand",b:"1F90F",k:[37,17],o:12},pineapple:{a:"Pineapple",b:"1F34D",j:["fruit","nature","food"],k:[6,37],o:2},shirt:{a:"T-Shirt",b:"1F455",k:[14,9],n:["tshirt"],o:2},service_dog:{a:"Service Dog",b:"1F415-200D-1F9BA",k:[11,49],o:12},baby_symbol:{a:"Baby Symbol",b:"1F6BC",j:["orange-square","child"],k:[36,13],o:2},joy:{a:"Face with Tears of Joy",b:"1F602",j:["face","cry","tears","weep","happy","happytears","haha"],k:[30,37],o:2},tada:{a:"Party Popper",b:"1F389",j:["party","congratulations","birthday","magic","circus","celebration"],k:[7,45],o:2},mango:{a:"Mango",b:"1F96D",k:[42,3],o:11},v:{a:"Victory Hand",b:"270C-FE0F",c:"270C",j:["fingers","ohyeah","hand","peace","victory","two"],k:[54,55],o:2},snow_capped_mountain:{a:"Snow Capped Mountain",b:"1F3D4-FE0F",c:"1F3D4",k:[10,39],o:2},"flag-ac":{a:"Ascension Island Flag",b:"1F1E6-1F1E8",k:[0,31],o:2},jeans:{a:"Jeans",b:"1F456",j:["fashion","shopping"],k:[14,10],o:2},poodle:{a:"Poodle",b:"1F429",j:["dog","animal","101","nature","pet"],k:[12,13],o:2},crossed_fingers:{a:"Hand with Index and Middle Fingers Crossed",b:"1F91E",j:["good","lucky"],k:[38,5],n:["hand_with_index_and_middle_fingers_crossed"],o:4},"flag-ad":{a:"Andorra Flag",b:"1F1E6-1F1E9",k:[0,32],o:2},slightly_smiling_face:{a:"Slightly Smiling Face",b:"1F642",j:["face","smile"],k:[31,44],l:[":)","(:",":-)"],o:2},apple:{a:"Red Apple",b:"1F34E",j:["fruit","mac","school"],k:[6,38],o:2},wc:{a:"Water Closet",b:"1F6BE",j:["toilet","restroom","blue-square"],k:[36,15],o:2},scarf:{a:"Scarf",b:"1F9E3",k:[51,22],o:5},mountain:{a:"Mountain",b:"26F0-FE0F",c:"26F0",j:["photo","nature","environment"],k:[54,11],o:2},confetti_ball:{a:"Confetti Ball",b:"1F38A",j:["festival","party","birthday","circus"],k:[7,46],o:2},i_love_you_hand_sign:{a:"I Love You Hand Sign",b:"1F91F",k:[38,11],o:5},wolf:{a:"Wolf Face",b:"1F43A",j:["animal","nature","wild"],k:[12,30],o:2},gloves:{a:"Gloves",b:"1F9E4",k:[51,23],o:5},"flag-ae":{a:"United Arab Emirates Flag",b:"1F1E6-1F1EA",k:[0,33],o:2},upside_down_face:{a:"Upside-Down Face",b:"1F643",j:["face","flipped","silly","smile"],k:[31,45],o:2},green_apple:{a:"Green Apple",b:"1F34F",j:["fruit","nature"],k:[6,39],o:2},passport_control:{a:"Passport Control",b:"1F6C2",j:["custom","blue-square"],k:[36,24],o:2},volcano:{a:"Volcano",b:"1F30B",j:["photo","nature","disaster"],k:[5,30],o:2},tanabata_tree:{a:"Tanabata Tree",b:"1F38B",j:["plant","nature","branch","summer"],k:[7,47],o:2},customs:{a:"Customs",b:"1F6C3",j:["passport","border","blue-square"],k:[36,25],o:2},coat:{a:"Coat",b:"1F9E5",k:[51,24],o:5},wink:{a:"Winking Face",b:"1F609",j:["face","happy","mischievous","secret",";)","smile","eye"],k:[30,44],l:[";)",";-)"],m:";)",o:2},bamboo:{a:"Pine Decoration",b:"1F38D",j:["plant","nature","vegetable","panda","pine_decoration"],k:[7,49],o:2},"flag-af":{a:"Afghanistan Flag",b:"1F1E6-1F1EB",k:[0,34],o:2},fox_face:{a:"Fox Face",b:"1F98A",j:["animal","nature","face"],k:[42,28],o:4},pear:{a:"Pear",b:"1F350",j:["fruit","nature","food"],k:[6,40],o:2},mount_fuji:{a:"Mount Fuji",b:"1F5FB",j:["photo","mountain","nature","japanese"],k:[30,30],o:2},the_horns:{a:"Sign of the Horns",b:"1F918",k:[37,31],n:["sign_of_the_horns"],o:2},call_me_hand:{a:"Call Me Hand",b:"1F919",j:["hands","gesture"],k:[37,37],o:4},"flag-ag":{a:"Antigua & Barbuda Flag",b:"1F1E6-1F1EC",k:[0,35],o:2},raccoon:{a:"Raccoon",b:"1F99D",k:[42,47],o:11},dolls:{a:"Japanese Dolls",b:"1F38E",j:["japanese","toy","kimono"],k:[7,50],o:2},blush:{a:"Smiling Face with Smiling Eyes",b:"1F60A",j:["face","smile","happy","flushed","crush","embarrassed","shy","joy"],k:[30,45],m:":)",o:2},peach:{a:"Peach",b:"1F351",j:["fruit","nature","food"],k:[6,41],o:2},baggage_claim:{a:"Baggage Claim",b:"1F6C4",j:["blue-square","airport","transport"],k:[36,26],o:2},socks:{a:"Socks",b:"1F9E6",k:[51,25],o:5},camping:{a:"Camping",b:"1F3D5-FE0F",c:"1F3D5",j:["photo","outdoors","tent"],k:[10,40],o:2},dress:{a:"Dress",b:"1F457",j:["clothes","fashion","shopping"],k:[14,11],o:2},beach_with_umbrella:{a:"Beach with Umbrella",b:"1F3D6-FE0F",c:"1F3D6",k:[10,41],o:2},cherries:{a:"Cherries",b:"1F352",j:["food","fruit"],k:[6,42],o:2},cat:{a:"Cat Face",b:"1F431",j:["animal","meow","nature","pet","kitten"],k:[12,21],o:2},point_left:{a:"White Left Pointing Backhand Index",b:"1F448",j:["direction","fingers","hand","left"],k:[13,8],o:2},left_luggage:{a:"Left Luggage",b:"1F6C5",j:["blue-square","travel"],k:[36,27],o:2},"flag-ai":{a:"Anguilla Flag",b:"1F1E6-1F1EE",k:[0,36],o:2},innocent:{a:"Smiling Face with Halo",b:"1F607",j:["face","angel","heaven","halo"],k:[30,42],o:2},flags:{a:"Carp Streamer",b:"1F38F",j:["fish","japanese","koinobori","carp","banner"],k:[7,51],o:2},warning:{a:"Warning Sign",b:"26A0-FE0F",c:"26A0",j:["exclamation","wip","alert","error","problem","issue"],k:[53,50],o:2},strawberry:{a:"Strawberry",b:"1F353",j:["fruit","food","nature"],k:[6,43],o:2},point_right:{a:"White Right Pointing Backhand Index",b:"1F449",j:["fingers","hand","direction","right"],k:[13,14],o:2},desert:{a:"Desert",b:"1F3DC-FE0F",c:"1F3DC",j:["photo","warm","saharah"],k:[10,47],o:2},kimono:{a:"Kimono",b:"1F458",j:["dress","fashion","women","female","japanese"],k:[14,12],o:2},"flag-al":{a:"Albania Flag",b:"1F1E6-1F1F1",k:[0,37],o:2},wind_chime:{a:"Wind Chime",b:"1F390",j:["nature","ding","spring","bell"],k:[7,52],o:2},smiling_face_with_3_hearts:{a:"Smiling Face with Smiling Eyes and Three Hearts",b:"1F970",k:[42,6],o:11},cat2:{a:"Cat",b:"1F408",j:["animal","meow","pet","cats"],k:[11,36],o:2},rice_scene:{a:"Moon Viewing Ceremony",b:"1F391",j:["photo","japan","asia","tsukimi"],k:[7,53],o:2},heart_eyes:{a:"Smiling Face with Heart-Shaped Eyes",b:"1F60D",j:["face","love","like","affection","valentines","infatuation","crush","heart"],k:[30,48],o:2},sari:{a:"Sari",b:"1F97B",k:[42,13],o:12},"flag-am":{a:"Armenia Flag",b:"1F1E6-1F1F2",k:[0,38],o:2},lion_face:{a:"Lion Face",b:"1F981",k:[42,19],o:2},desert_island:{a:"Desert Island",b:"1F3DD-FE0F",c:"1F3DD",j:["photo","tropical","mojito"],k:[10,48],o:2},point_up_2:{a:"White Up Pointing Backhand Index",b:"1F446",j:["fingers","hand","direction","up"],k:[12,53],o:2},kiwifruit:{a:"Kiwifruit",b:"1F95D",k:[41,44],o:4},children_crossing:{a:"Children Crossing",b:"1F6B8",j:["school","warning","danger","sign","driving","yellow-diamond"],k:[36,9],o:2},national_park:{a:"National Park",b:"1F3DE-FE0F",c:"1F3DE",j:["photo","environment","nature"],k:[10,49],o:2},no_entry:{a:"No Entry",b:"26D4",j:["limit","security","privacy","bad","denied","stop","circle"],k:[54,8],o:2},"one-piece_swimsuit":{a:"One-Piece Swimsuit",b:"1FA71",k:[51,52],o:12},tiger:{a:"Tiger Face",b:"1F42F",j:["animal","cat","danger","wild","nature","roar"],k:[12,19],o:2},red_envelope:{a:"Red Gift Envelope",b:"1F9E7",k:[51,26],o:11},"star-struck":{a:"Grinning Face with Star Eyes",b:"1F929",k:[38,43],n:["grinning_face_with_star_eyes"],o:5},middle_finger:{a:"Reversed Hand with Middle Finger Extended",b:"1F595",k:[29,54],n:["reversed_hand_with_middle_finger_extended"],o:2},"flag-ao":{a:"Angola Flag",b:"1F1E6-1F1F4",k:[0,39],o:2},tomato:{a:"Tomato",b:"1F345",j:["fruit","vegetable","nature","food"],k:[6,29],o:2},coconut:{a:"Coconut",b:"1F965",k:[41,52],o:5},ribbon:{a:"Ribbon",b:"1F380",j:["decoration","pink","girl","bowtie"],k:[7,31],o:2},no_entry_sign:{a:"No Entry Sign",b:"1F6AB",j:["forbid","stop","limit","denied","disallow","circle"],k:[35,2],o:2},point_down:{a:"White Down Pointing Backhand Index",b:"1F447",j:["fingers","hand","direction","down"],k:[13,2],o:2},"flag-aq":{a:"Antarctica Flag",b:"1F1E6-1F1F6",k:[0,40],o:2},briefs:{a:"Briefs",b:"1FA72",k:[51,53],o:12},kissing_heart:{a:"Face Throwing a Kiss",b:"1F618",j:["face","love","like","affection","valentines","infatuation","kiss"],k:[31,2],l:[":*",":-*"],o:2},tiger2:{a:"Tiger",b:"1F405",j:["animal","nature","roar"],k:[11,33],o:2},stadium:{a:"Stadium",b:"1F3DF-FE0F",c:"1F3DF",j:["photo","place","sports","concert","venue"],k:[10,50],o:2},leopard:{a:"Leopard",b:"1F406",j:["animal","nature"],k:[11,34],o:2},no_bicycles:{a:"No Bicycles",b:"1F6B3",j:["cyclist","prohibited","circle"],k:[35,10],o:2},kissing:{a:"Kissing Face",b:"1F617",j:["love","like","face","3","valentines","infatuation","kiss"],k:[31,1],o:2},"flag-ar":{a:"Argentina Flag",b:"1F1E6-1F1F7",k:[0,41],o:2},avocado:{a:"Avocado",b:"1F951",j:["fruit","food"],k:[41,32],o:4},point_up:{a:"White Up Pointing Index",b:"261D-FE0F",c:"261D",j:["hand","fingers","direction","up"],k:[53,2],o:2},gift:{a:"Wrapped Present",b:"1F381",j:["present","birthday","christmas","xmas"],k:[7,32],o:2},classical_building:{a:"Classical Building",b:"1F3DB-FE0F",c:"1F3DB",j:["art","culture","history"],k:[10,46],o:2},shorts:{a:"Shorts",b:"1FA73",k:[51,54],o:12},"+1":{a:"Thumbs Up Sign",b:"1F44D",j:["thumbsup","yes","awesome","good","agree","accept","cool","hand","like"],k:[13,38],n:["thumbsup"],o:2},horse:{a:"Horse Face",b:"1F434",j:["animal","brown","nature"],k:[12,24],o:2},bikini:{a:"Bikini",b:"1F459",j:["swimming","female","woman","girl","fashion","beach","summer"],k:[14,13],o:2},no_smoking:{a:"No Smoking Symbol",b:"1F6AD",j:["cigarette","blue-square","smell","smoke"],k:[35,4],o:2},eggplant:{a:"Aubergine",b:"1F346",j:["vegetable","nature","food","aubergine"],k:[6,30],o:2},"flag-as":{a:"American Samoa Flag",b:"1F1E6-1F1F8",k:[0,42],o:2},reminder_ribbon:{a:"Reminder Ribbon",b:"1F397-FE0F",c:"1F397",j:["sports","cause","support","awareness"],k:[8,0],o:2},building_construction:{a:"Building Construction",b:"1F3D7-FE0F",c:"1F3D7",j:["wip","working","progress"],k:[10,42],o:2},relaxed:{a:"White Smiling Face",b:"263A-FE0F",c:"263A",j:["face","blush","massage","happiness"],k:[53,17],o:2},kissing_closed_eyes:{a:"Kissing Face with Closed Eyes",b:"1F61A",j:["face","love","like","affection","valentines","infatuation","kiss"],k:[31,4],o:2},"-1":{a:"Thumbs Down Sign",b:"1F44E",j:["thumbsdown","no","dislike","hand"],k:[13,44],n:["thumbsdown"],o:2},admission_tickets:{a:"Admission Tickets",b:"1F39F-FE0F",c:"1F39F",k:[8,5],o:2},"flag-at":{a:"Austria Flag",b:"1F1E6-1F1F9",k:[0,43],o:2},womans_clothes:{a:"Womans Clothes",b:"1F45A",j:["fashion","shopping_bags","female"],k:[14,14],o:2},do_not_litter:{a:"Do Not Litter Symbol",b:"1F6AF",j:["trash","bin","garbage","circle"],k:[35,6],o:2},potato:{a:"Potato",b:"1F954",j:["food","tuber","vegatable","starch"],k:[41,35],o:4},racehorse:{a:"Horse",b:"1F40E",j:["animal","gamble","luck"],k:[11,42],o:2},bricks:{a:"Brick",b:"1F9F1",k:[51,36],o:11},fist:{a:"Raised Fist",b:"270A",j:["fingers","hand","grasp"],k:[54,43],o:2},house_buildings:{a:"House Buildings",b:"1F3D8-FE0F",c:"1F3D8",k:[10,43],o:2},carrot:{a:"Carrot",b:"1F955",j:["vegetable","food","orange"],k:[41,36],o:4},ticket:{a:"Ticket",b:"1F3AB",j:["event","concert","pass"],k:[8,17],o:2},"flag-au":{a:"Australia Flag",b:"1F1E6-1F1FA",k:[0,44],o:2},"non-potable_water":{a:"Non-Potable Water Symbol",b:"1F6B1",j:["drink","faucet","tap","circle"],k:[35,8],o:2},purse:{a:"Purse",b:"1F45B",j:["fashion","accessories","money","sales","shopping"],k:[14,15],o:2},unicorn_face:{a:"Unicorn Face",b:"1F984",k:[42,22],o:2},kissing_smiling_eyes:{a:"Kissing Face with Smiling Eyes",b:"1F619",j:["face","affection","valentines","infatuation","kiss"],k:[31,3],o:2},facepunch:{a:"Fisted Hand Sign",b:"1F44A",j:["angry","violence","fist","hit","attack","hand"],k:[13,20],n:["punch"],o:2},medal:{a:"Medal",b:"1F396-FE0F",c:"1F396",k:[7,56],o:2},zebra_face:{a:"Zebra Face",b:"1F993",k:[42,37],o:5},handbag:{a:"Handbag",b:"1F45C",j:["fashion","accessory","accessories","shopping"],k:[14,16],o:2},derelict_house_building:{a:"Derelict House Building",b:"1F3DA-FE0F",c:"1F3DA",k:[10,45],o:2},yum:{a:"Face Savouring Delicious Food",b:"1F60B",j:["happy","joy","tongue","smile","face","silly","yummy","nom","delicious","savouring"],k:[30,46],o:2},corn:{a:"Ear of Maize",b:"1F33D",j:["food","vegetable","plant"],k:[6,21],o:2},"flag-aw":{a:"Aruba Flag",b:"1F1E6-1F1FC",k:[0,45],o:2},no_pedestrians:{a:"No Pedestrians",b:"1F6B7",j:["rules","crossing","walking","circle"],k:[36,8],o:2},house:{a:"House Building",b:"1F3E0",j:["building","home"],k:[10,51],o:2},hot_pepper:{a:"Hot Pepper",b:"1F336-FE0F",c:"1F336",j:["food","spicy","chilli","chili"],k:[6,14],o:2},"flag-ax":{a:"Åland Islands Flag",b:"1F1E6-1F1FD",k:[0,46],o:2},trophy:{a:"Trophy",b:"1F3C6",j:["win","award","contest","place","ftw","ceremony"],k:[9,26],o:2},deer:{a:"Deer",b:"1F98C",j:["animal","nature","horns","venison"],k:[42,30],o:4},"left-facing_fist":{a:"Left-Facing Fist",b:"1F91B",k:[37,49],o:4},stuck_out_tongue:{a:"Face with Stuck-out Tongue",b:"1F61B",j:["face","prank","childish","playful","mischievous","smile","tongue"],k:[31,5],l:[":p",":-p",":P",":-P",":b",":-b"],m:":p",o:2},pouch:{a:"Pouch",b:"1F45D",j:["bag","accessories","shopping"],k:[14,17],o:2},no_mobile_phones:{a:"No Mobile Phones",b:"1F4F5",j:["iphone","mute","circle"],k:[27,18],o:2},stuck_out_tongue_winking_eye:{a:"Face with Stuck-out Tongue and Winking Eye",b:"1F61C",j:["face","prank","childish","playful","mischievous","smile","wink","tongue"],k:[31,6],l:[";p",";-p",";b",";-b",";P",";-P"],m:";p",o:2},sports_medal:{a:"Sports Medal",b:"1F3C5",k:[9,25],o:2},cucumber:{a:"Cucumber",b:"1F952",j:["fruit","food","pickle"],k:[41,33],o:4},cow:{a:"Cow Face",b:"1F42E",j:["beef","ox","animal","nature","moo","milk"],k:[12,18],o:2},underage:{a:"No One Under Eighteen Symbol",b:"1F51E",j:["18","drink","pub","night","minor","circle"],k:[28,1],o:2},"flag-az":{a:"Azerbaijan Flag",b:"1F1E6-1F1FF",k:[0,47],o:2},shopping_bags:{a:"Shopping Bags",b:"1F6CD-FE0F",c:"1F6CD",k:[36,35],o:2},"right-facing_fist":{a:"Right-Facing Fist",b:"1F91C",k:[37,55],o:4},house_with_garden:{a:"House with Garden",b:"1F3E1",j:["home","plant","nature"],k:[10,52],o:2},clap:{a:"Clapping Hands Sign",b:"1F44F",j:["hands","praise","applause","congrats","yay"],k:[13,50],o:2},leafy_green:{a:"Leafy Green",b:"1F96C",k:[42,2],o:11},office:{a:"Office Building",b:"1F3E2",j:["building","bureau","work"],k:[10,53],o:2},"flag-ba":{a:"Bosnia & Herzegovina Flag",b:"1F1E7-1F1E6",k:[0,48],o:2},zany_face:{a:"Grinning Face with One Large and One Small Eye",b:"1F92A",k:[38,44],n:["grinning_face_with_one_large_and_one_small_eye"],o:5},first_place_medal:{a:"First Place Medal",b:"1F947",k:[41,22],o:4},ox:{a:"Ox",b:"1F402",j:["animal","cow","beef"],k:[11,30],o:2},school_satchel:{a:"School Satchel",b:"1F392",j:["student","education","bag","backpack"],k:[7,54],o:2},radioactive_sign:{a:"Radioactive Sign",b:"2622-FE0F",c:"2622",k:[53,9],o:2},second_place_medal:{a:"Second Place Medal",b:"1F948",k:[41,23],o:4},stuck_out_tongue_closed_eyes:{a:"Face with Stuck-out Tongue and Tightly-Closed Eyes",b:"1F61D",j:["face","prank","playful","mischievous","smile","tongue"],k:[31,7],o:2},broccoli:{a:"Broccoli",b:"1F966",k:[41,53],o:5},biohazard_sign:{a:"Biohazard Sign",b:"2623-FE0F",c:"2623",k:[53,10],o:2},mans_shoe:{a:"Mans Shoe",b:"1F45E",j:["fashion","male"],k:[14,18],n:["shoe"],o:2},raised_hands:{a:"Person Raising Both Hands in Celebration",b:"1F64C",j:["gesture","hooray","yea","celebration","hands"],k:[33,8],o:2},post_office:{a:"Japanese Post Office",b:"1F3E3",j:["building","envelope","communication"],k:[10,54],o:2},"flag-bb":{a:"Barbados Flag",b:"1F1E7-1F1E7",k:[0,49],o:2},water_buffalo:{a:"Water Buffalo",b:"1F403",j:["animal","nature","ox","cow"],k:[11,31],o:2},third_place_medal:{a:"Third Place Medal",b:"1F949",k:[41,24],o:4},european_post_office:{a:"European Post Office",b:"1F3E4",j:["building","email"],k:[10,55],o:2},athletic_shoe:{a:"Athletic Shoe",b:"1F45F",j:["shoes","sports","sneakers"],k:[14,19],o:2},arrow_up:{a:"Upwards Black Arrow",b:"2B06-FE0F",c:"2B06",j:["blue-square","continue","top","direction"],k:[55,38],o:2},cow2:{a:"Cow",b:"1F404",j:["beef","ox","animal","nature","moo","milk"],k:[11,32],o:2},open_hands:{a:"Open Hands Sign",b:"1F450",j:["fingers","butterfly","hands","open"],k:[13,56],o:2},garlic:{a:"Garlic",b:"1F9C4",k:[44,12],o:12},money_mouth_face:{a:"Money-Mouth Face",b:"1F911",j:["face","rich","dollar","money"],k:[37,24],o:2},"flag-bd":{a:"Bangladesh Flag",b:"1F1E7-1F1E9",k:[0,50],o:2},soccer:{a:"Soccer Ball",b:"26BD",j:["sports","football"],k:[53,56],o:2},hugging_face:{a:"Hugging Face",b:"1F917",k:[37,30],o:2},onion:{a:"Onion",b:"1F9C5",k:[44,13],o:12},arrow_upper_right:{a:"North East Arrow",b:"2197-FE0F",c:"2197",j:["blue-square","point","direction","diagonal","northeast"],k:[52,17],o:2},palms_up_together:{a:"Palms Up Together",b:"1F932",k:[39,5],o:5},pig:{a:"Pig Face",b:"1F437",j:["animal","oink","nature"],k:[12,27],o:2},hospital:{a:"Hospital",b:"1F3E5",j:["building","health","surgery","doctor"],k:[10,56],o:2},hiking_boot:{a:"Hiking Boot",b:"1F97E",k:[42,16],o:11},"flag-be":{a:"Belgium Flag",b:"1F1E7-1F1EA",k:[0,51],o:2},"flag-bf":{a:"Burkina Faso Flag",b:"1F1E7-1F1EB",k:[0,52],o:2},mushroom:{a:"Mushroom",b:"1F344",j:["plant","vegetable"],k:[6,28],o:2},pig2:{a:"Pig",b:"1F416",j:["animal","nature"],k:[11,51],o:2},baseball:{a:"Baseball",b:"26BE",j:["sports","balls"],k:[54,0],o:2},face_with_hand_over_mouth:{a:"Smiling Face with Smiling Eyes and Hand Covering Mouth",b:"1F92D",k:[38,47],n:["smiling_face_with_smiling_eyes_and_hand_covering_mouth"],o:5},handshake:{a:"Handshake",b:"1F91D",j:["agreement","shake"],k:[38,4],o:4},womans_flat_shoe:{a:"Flat Shoe",b:"1F97F",k:[42,17],o:11},bank:{a:"Bank",b:"1F3E6",j:["building","money","sales","cash","business","enterprise"],k:[11,0],o:2},arrow_right:{a:"Black Rightwards Arrow",b:"27A1-FE0F",c:"27A1",j:["blue-square","next"],k:[55,32],o:2},peanuts:{a:"Peanuts",b:"1F95C",j:["food","nut"],k:[41,43],o:4},shushing_face:{a:"Face with Finger Covering Closed Lips",b:"1F92B",k:[38,45],n:["face_with_finger_covering_closed_lips"],o:5},pray:{a:"Person with Folded Hands",b:"1F64F",j:["please","hope","wish","namaste","highfive"],k:[33,50],o:2},softball:{a:"Softball",b:"1F94E",k:[41,29],o:11},high_heel:{a:"High-Heeled Shoe",b:"1F460",j:["fashion","shoes","female","pumps","stiletto"],k:[14,20],o:2},"flag-bg":{a:"Bulgaria Flag",b:"1F1E7-1F1EC",k:[0,53],o:2},arrow_lower_right:{a:"South East Arrow",b:"2198-FE0F",c:"2198",j:["blue-square","direction","diagonal","southeast"],k:[52,18],o:2},hotel:{a:"Hotel",b:"1F3E8",j:["building","accomodation","checkin"],k:[11,2],o:2},boar:{a:"Boar",b:"1F417",j:["animal","nature"],k:[11,52],o:2},sandal:{a:"Womans Sandal",b:"1F461",j:["shoes","fashion","flip flops"],k:[14,21],o:2},"flag-bh":{a:"Bahrain Flag",b:"1F1E7-1F1ED",k:[0,54],o:2},arrow_down:{a:"Downwards Black Arrow",b:"2B07-FE0F",c:"2B07",j:["blue-square","direction","bottom"],k:[55,39],o:2},thinking_face:{a:"Thinking Face",b:"1F914",k:[37,27],o:2},writing_hand:{a:"Writing Hand",b:"270D-FE0F",c:"270D",j:["lower_left_ballpoint_pen","stationery","write","compose"],k:[55,4],o:2},chestnut:{a:"Chestnut",b:"1F330",j:["food","squirrel"],k:[6,8],o:2},basketball:{a:"Basketball and Hoop",b:"1F3C0",j:["sports","balls","NBA"],k:[8,38],o:2},pig_nose:{a:"Pig Nose",b:"1F43D",j:["animal","oink"],k:[12,33],o:2},love_hotel:{a:"Love Hotel",b:"1F3E9",j:["like","affection","dating"],k:[11,3],o:2},nail_care:{a:"Nail Polish",b:"1F485",j:["beauty","manicure","finger","fashion","nail"],k:[24,33],o:2},volleyball:{a:"Volleyball",b:"1F3D0",j:["sports","balls"],k:[10,35],o:2},"flag-bi":{a:"Burundi Flag",b:"1F1E7-1F1EE",k:[0,55],o:2},arrow_lower_left:{a:"South West Arrow",b:"2199-FE0F",c:"2199",j:["blue-square","direction","diagonal","southwest"],k:[52,19],o:2},ram:{a:"Ram",b:"1F40F",j:["animal","sheep","nature"],k:[11,43],o:2},ballet_shoes:{a:"Ballet Shoes",b:"1FA70",k:[51,51],o:12},zipper_mouth_face:{a:"Zipper-Mouth Face",b:"1F910",j:["face","sealed","zipper","secret"],k:[37,23],o:2},bread:{a:"Bread",b:"1F35E",j:["food","wheat","breakfast","toast"],k:[6,54],o:2},convenience_store:{a:"Convenience Store",b:"1F3EA",j:["building","shopping","groceries"],k:[11,4],o:2},boot:{a:"Womans Boots",b:"1F462",j:["shoes","fashion"],k:[14,22],o:2},sheep:{a:"Sheep",b:"1F411",j:["animal","nature","wool","shipit"],k:[11,45],o:2},face_with_raised_eyebrow:{a:"Face with One Eyebrow Raised",b:"1F928",k:[38,42],n:["face_with_one_eyebrow_raised"],o:5},"flag-bj":{a:"Benin Flag",b:"1F1E7-1F1EF",k:[0,56],o:2},arrow_left:{a:"Leftwards Black Arrow",b:"2B05-FE0F",c:"2B05",j:["blue-square","previous","back"],k:[55,37],o:2},selfie:{a:"Selfie",b:"1F933",j:["camera","phone"],k:[39,11],o:4},croissant:{a:"Croissant",b:"1F950",j:["food","bread","french"],k:[41,31],o:4},school:{a:"School",b:"1F3EB",j:["building","student","education","learn","teach"],k:[11,5],o:2},football:{a:"American Football",b:"1F3C8",j:["sports","balls","NFL"],k:[9,33],o:2},goat:{a:"Goat",b:"1F410",j:["animal","nature"],k:[11,44],o:2},department_store:{a:"Department Store",b:"1F3EC",j:["building","shopping","mall"],k:[11,6],o:2},"flag-bl":{a:"St. Barthélemy Flag",b:"1F1E7-1F1F1",k:[1,0],o:2},crown:{a:"Crown",b:"1F451",j:["king","kod","leader","royalty","lord"],k:[14,5],o:2},arrow_upper_left:{a:"North West Arrow",b:"2196-FE0F",c:"2196",j:["blue-square","point","direction","diagonal","northwest"],k:[52,16],o:2},neutral_face:{a:"Neutral Face",b:"1F610",j:["indifference","meh",":|","neutral"],k:[30,51],l:[":|",":-|"],o:2},rugby_football:{a:"Rugby Football",b:"1F3C9",j:["sports","team"],k:[9,34],o:2},muscle:{a:"Flexed Biceps",b:"1F4AA",j:["arm","flex","hand","summer","strong","biceps"],k:[25,52],o:2},baguette_bread:{a:"Baguette Bread",b:"1F956",j:["food","bread","french"],k:[41,37],o:4},expressionless:{a:"Expressionless Face",b:"1F611",j:["face","indifferent","-_-","meh","deadpan"],k:[30,52],o:2},womans_hat:{a:"Womans Hat",b:"1F452",j:["fashion","accessories","female","lady","spring"],k:[14,6],o:2},pretzel:{a:"Pretzel",b:"1F968",k:[41,55],o:5},mechanical_arm:{a:"Mechanical Arm",b:"1F9BE",k:[44,6],o:12},arrow_up_down:{a:"Up Down Arrow",b:"2195-FE0F",c:"2195",j:["blue-square","direction","way","vertical"],k:[52,15],o:2},dromedary_camel:{a:"Dromedary Camel",b:"1F42A",j:["animal","hot","desert","hump"],k:[12,14],o:2},tennis:{a:"Tennis Racquet and Ball",b:"1F3BE",j:["sports","balls","green"],k:[8,36],o:2},"flag-bm":{a:"Bermuda Flag",b:"1F1E7-1F1F2",k:[1,1],o:2},factory:{a:"Factory",b:"1F3ED",j:["building","industry","pollution","smoke"],k:[11,7],o:2},japanese_castle:{a:"Japanese Castle",b:"1F3EF",j:["photo","building"],k:[11,9],o:2},no_mouth:{a:"Face Without Mouth",b:"1F636",j:["face","hellokitty"],k:[31,32],o:2},mechanical_leg:{a:"Mechanical Leg",b:"1F9BF",k:[44,7],o:12},bagel:{a:"Bagel",b:"1F96F",k:[42,5],o:11},camel:{a:"Bactrian Camel",b:"1F42B",j:["animal","nature","hot","desert","hump"],k:[12,15],o:2},tophat:{a:"Top Hat",b:"1F3A9",j:["magic","gentleman","classy","circus"],k:[8,15],o:2},left_right_arrow:{a:"Left Right Arrow",b:"2194-FE0F",c:"2194",j:["shape","direction","horizontal","sideways"],k:[52,14],o:2},"flag-bn":{a:"Brunei Flag",b:"1F1E7-1F1F3",k:[1,2],o:2},flying_disc:{a:"Flying Disc",b:"1F94F",k:[41,30],o:11},smirk:{a:"Smirking Face",b:"1F60F",j:["face","smile","mean","prank","smug","sarcasm"],k:[30,50],o:2},mortar_board:{a:"Graduation Cap",b:"1F393",j:["school","college","degree","university","graduation","cap","hat","legal","learn","education"],k:[7,55],o:2},european_castle:{a:"European Castle",b:"1F3F0",j:["building","royalty","history"],k:[11,10],o:2},leg:{a:"Leg",b:"1F9B5",k:[43,5],o:11},pancakes:{a:"Pancakes",b:"1F95E",j:["food","breakfast","flapjacks","hotcakes"],k:[41,45],o:4},leftwards_arrow_with_hook:{a:"Leftwards Arrow with Hook",b:"21A9-FE0F",c:"21A9",j:["back","return","blue-square","undo","enter"],k:[52,20],o:2},"flag-bo":{a:"Bolivia Flag",b:"1F1E7-1F1F4",k:[1,3],o:2},bowling:{a:"Bowling",b:"1F3B3",j:["sports","fun","play"],k:[8,25],o:2},llama:{a:"Llama",b:"1F999",k:[42,43],o:11},arrow_right_hook:{a:"Rightwards Arrow with Hook",b:"21AA-FE0F",c:"21AA",j:["blue-square","return","rotate","direction"],k:[52,21],o:2},wedding:{a:"Wedding",b:"1F492",j:["love","like","affection","couple","marriage","bride","groom"],k:[25,28],o:2},"flag-bq":{a:"Caribbean Netherlands Flag",b:"1F1E7-1F1F6",k:[1,4],o:2},foot:{a:"Foot",b:"1F9B6",k:[43,11],o:11},giraffe_face:{a:"Giraffe Face",b:"1F992",k:[42,36],o:5},unamused:{a:"Unamused Face",b:"1F612",j:["indifference","bored","straight face","serious","sarcasm"],k:[30,53],m:":(",o:2},billed_cap:{a:"Billed Cap",b:"1F9E2",k:[51,21],o:5},waffle:{a:"Waffle",b:"1F9C7",k:[44,15],o:12},cricket_bat_and_ball:{a:"Cricket Bat and Ball",b:"1F3CF",k:[10,34],o:2},helmet_with_white_cross:{a:"Helmet with White Cross",b:"26D1-FE0F",c:"26D1",k:[54,6],o:2},ear:{a:"Ear",b:"1F442",j:["face","hear","sound","listen"],k:[12,39],o:2},elephant:{a:"Elephant",b:"1F418",j:["animal","nature","nose","th","circus"],k:[11,53],o:2},cheese_wedge:{a:"Cheese Wedge",b:"1F9C0",k:[44,8],o:2},tokyo_tower:{a:"Tokyo Tower",b:"1F5FC",j:["photo","japanese"],k:[30,31],o:2},arrow_heading_up:{a:"Arrow Pointing Rightwards Then Curving Upwards",b:"2934-FE0F",c:"2934",j:["blue-square","direction","top"],k:[55,35],o:2},field_hockey_stick_and_ball:{a:"Field Hockey Stick and Ball",b:"1F3D1",k:[10,36],o:2},"flag-br":{a:"Brazil Flag",b:"1F1E7-1F1F7",k:[1,5],o:2},face_with_rolling_eyes:{a:"Face with Rolling Eyes",b:"1F644",k:[31,46],o:2},ear_with_hearing_aid:{a:"Ear with Hearing Aid",b:"1F9BB",k:[43,55],o:12},arrow_heading_down:{a:"Arrow Pointing Rightwards Then Curving Downwards",b:"2935-FE0F",c:"2935",j:["blue-square","direction","bottom"],k:[55,36],o:2},ice_hockey_stick_and_puck:{a:"Ice Hockey Stick and Puck",b:"1F3D2",k:[10,37],o:2},meat_on_bone:{a:"Meat on Bone",b:"1F356",j:["good","food","drumstick"],k:[6,46],o:2},prayer_beads:{a:"Prayer Beads",b:"1F4FF",j:["dhikr","religious"],k:[27,27],o:2},statue_of_liberty:{a:"Statue of Liberty",b:"1F5FD",j:["american","newyork"],k:[30,32],o:2},grimacing:{a:"Grimacing Face",b:"1F62C",j:["face","grimace","teeth"],k:[31,22],o:2},"flag-bs":{a:"Bahamas Flag",b:"1F1E7-1F1F8",k:[1,6],o:2},rhinoceros:{a:"Rhinoceros",b:"1F98F",j:["animal","nature","horn"],k:[42,33],o:4},lacrosse:{a:"Lacrosse Stick and Ball",b:"1F94D",k:[41,28],o:11},poultry_leg:{a:"Poultry Leg",b:"1F357",j:["food","meat","drumstick","bird","chicken","turkey"],k:[6,47],o:2},hippopotamus:{a:"Hippopotamus",b:"1F99B",k:[42,45],o:11},nose:{a:"Nose",b:"1F443",j:["smell","sniff"],k:[12,45],o:2},arrows_clockwise:{a:"Clockwise Downwards and Upwards Open Circle Arrows",b:"1F503",j:["sync","cycle","round","repeat"],k:[27,31],o:2},"flag-bt":{a:"Bhutan Flag",b:"1F1E7-1F1F9",k:[1,7],o:2},church:{a:"Church",b:"26EA",j:["building","religion","christ"],k:[54,10],o:2},lipstick:{a:"Lipstick",b:"1F484",j:["female","girl","fashion","woman"],k:[24,32],o:2},lying_face:{a:"Lying Face",b:"1F925",j:["face","lie","pinocchio"],k:[38,22],o:4},arrows_counterclockwise:{a:"Anticlockwise Downwards and Upwards Open Circle Arrows",b:"1F504",j:["blue-square","sync","cycle"],k:[27,32],o:2},"flag-bv":{a:"Bouvet Island Flag",b:"1F1E7-1F1FB",k:[1,8],o:2},cut_of_meat:{a:"Cut of Meat",b:"1F969",k:[41,56],o:5},mosque:{a:"Mosque",b:"1F54C",j:["islam","worship","minaret"],k:[28,36],o:2},ring:{a:"Ring",b:"1F48D",j:["wedding","propose","marriage","valentines","diamond","fashion","jewelry","gem","engagement"],k:[25,23],o:2},brain:{a:"Brain",b:"1F9E0",k:[51,19],o:5},table_tennis_paddle_and_ball:{a:"Table Tennis Paddle and Ball",b:"1F3D3",k:[10,38],o:2},relieved:{a:"Relieved Face",b:"1F60C",j:["face","relaxed","phew","massage","happiness"],k:[30,47],o:2},mouse:{a:"Mouse Face",b:"1F42D",j:["animal","nature","cheese_wedge","rodent"],k:[12,17],o:2},hindu_temple:{a:"Hindu Temple",b:"1F6D5",k:[36,41],o:12},back:{a:"Back with Leftwards Arrow Above",b:"1F519",j:["arrow","words","return"],k:[27,53],o:2},gem:{a:"Gem Stone",b:"1F48E",j:["blue","ruby","diamond","jewelry"],k:[25,24],o:2},pensive:{a:"Pensive Face",b:"1F614",j:["face","sad","depressed","upset"],k:[30,55],o:2},"flag-bw":{a:"Botswana Flag",b:"1F1E7-1F1FC",k:[1,9],o:2},mouse2:{a:"Mouse",b:"1F401",j:["animal","nature","rodent"],k:[11,29],o:2},bacon:{a:"Bacon",b:"1F953",j:["food","breakfast","pork","pig","meat"],k:[41,34],o:4},tooth:{a:"Tooth",b:"1F9B7",k:[43,17],o:11},badminton_racquet_and_shuttlecock:{a:"Badminton Racquet and Shuttlecock",b:"1F3F8",k:[11,20],o:2},rat:{a:"Rat",b:"1F400",j:["animal","mouse","rodent"],k:[11,28],o:2},synagogue:{a:"Synagogue",b:"1F54D",j:["judaism","worship","temple","jewish"],k:[28,37],o:2},end:{a:"End with Leftwards Arrow Above",b:"1F51A",j:["words","arrow"],k:[27,54],o:2},bone:{a:"Bone",b:"1F9B4",k:[43,4],o:11},boxing_glove:{a:"Boxing Glove",b:"1F94A",j:["sports","fighting"],k:[41,25],o:4},mute:{a:"Speaker with Cancellation Stroke",b:"1F507",j:["sound","volume","silence","quiet"],k:[27,35],o:2},hamburger:{a:"Hamburger",b:"1F354",j:["meat","fast food","beef","cheeseburger","mcdonalds","burger king"],k:[6,44],o:2},"flag-by":{a:"Belarus Flag",b:"1F1E7-1F1FE",k:[1,10],o:2},sleepy:{a:"Sleepy Face",b:"1F62A",j:["face","tired","rest","nap"],k:[31,20],o:2},on:{a:"On with Exclamation Mark with Left Right Arrow Above",b:"1F51B",j:["arrow","words"],k:[27,55],o:2},martial_arts_uniform:{a:"Martial Arts Uniform",b:"1F94B",j:["judo","karate","taekwondo"],k:[41,26],o:4},speaker:{a:"Speaker",b:"1F508",j:["sound","volume","silence","broadcast"],k:[27,36],o:2},drooling_face:{a:"Drooling Face",b:"1F924",j:["face"],k:[38,21],o:4},eyes:{a:"Eyes",b:"1F440",j:["look","watch","stalk","peek","see"],k:[12,36],o:2},"flag-bz":{a:"Belize Flag",b:"1F1E7-1F1FF",k:[1,11],o:2},hamster:{a:"Hamster Face",b:"1F439",j:["animal","nature"],k:[12,29],o:2},shinto_shrine:{a:"Shinto Shrine",b:"26E9-FE0F",c:"26E9",j:["temple","japan","kyoto"],k:[54,9],o:2},fries:{a:"French Fries",b:"1F35F",j:["chips","snack","fast food"],k:[6,55],o:2},goal_net:{a:"Goal Net",b:"1F945",j:["sports"],k:[41,21],o:4},kaaba:{a:"Kaaba",b:"1F54B",j:["mecca","mosque","islam"],k:[28,35],o:2},soon:{a:"Soon with Rightwards Arrow Above",b:"1F51C",j:["arrow","words"],k:[27,56],o:2},"flag-ca":{a:"Canada Flag",b:"1F1E8-1F1E6",k:[1,12],o:2},rabbit:{a:"Rabbit Face",b:"1F430",j:["animal","nature","pet","spring","magic","bunny"],k:[12,20],o:2},eye:{a:"Eye",b:"1F441-FE0F",c:"1F441",j:["face","look","see","watch","stare"],k:[12,38],o:2},sleeping:{a:"Sleeping Face",b:"1F634",j:["face","tired","sleepy","night","zzz"],k:[31,30],o:2},pizza:{a:"Slice of Pizza",b:"1F355",j:["food","party"],k:[6,45],o:2},sound:{a:"Speaker with One Sound Wave",b:"1F509",j:["volume","speaker","broadcast"],k:[27,37],o:2},rabbit2:{a:"Rabbit",b:"1F407",j:["animal","nature","pet","magic","spring"],k:[11,35],o:2},fountain:{a:"Fountain",b:"26F2",j:["photo","summer","water","fresh"],k:[54,13],o:2},golf:{a:"Flag in Hole",b:"26F3",j:["sports","business","flag","hole","summer"],k:[54,14],o:2},top:{a:"Top with Upwards Arrow Above",b:"1F51D",j:["words","blue-square"],k:[28,0],o:2},mask:{a:"Face with Medical Mask",b:"1F637",j:["face","sick","ill","disease"],k:[31,33],o:2},"flag-cc":{a:"Cocos (keeling) Islands Flag",b:"1F1E8-1F1E8",k:[1,13],o:2},hotdog:{a:"Hot Dog",b:"1F32D",j:["food","frankfurter"],k:[6,5],o:2},loud_sound:{a:"Speaker with Three Sound Waves",b:"1F50A",j:["volume","noise","noisy","speaker","broadcast"],k:[27,38],o:2},tongue:{a:"Tongue",b:"1F445",j:["mouth","playful"],k:[12,52],o:2},place_of_worship:{a:"Place of Worship",b:"1F6D0",j:["religion","church","temple","prayer"],k:[36,38],o:2},ice_skate:{a:"Ice Skate",b:"26F8-FE0F",c:"26F8",j:["sports"],k:[54,18],o:2},sandwich:{a:"Sandwich",b:"1F96A",k:[42,0],o:5},chipmunk:{a:"Chipmunk",b:"1F43F-FE0F",c:"1F43F",j:["animal","nature","rodent","squirrel"],k:[12,35],o:2},loudspeaker:{a:"Public Address Loudspeaker",b:"1F4E2",j:["volume","sound"],k:[26,56],o:2},lips:{a:"Mouth",b:"1F444",j:["mouth","kiss"],k:[12,51],o:2},"flag-cd":{a:"Congo - Kinshasa Flag",b:"1F1E8-1F1E9",k:[1,14],o:2},tent:{a:"Tent",b:"26FA",j:["photo","camping","outdoors"],k:[54,37],o:2},face_with_thermometer:{a:"Face with Thermometer",b:"1F912",j:["sick","temperature","thermometer","cold","fever"],k:[37,25],o:2},taco:{a:"Taco",b:"1F32E",j:["food","mexican"],k:[6,6],o:2},foggy:{a:"Foggy",b:"1F301",j:["photo","mountain"],k:[5,20],o:2},"flag-cf":{a:"Central African Republic Flag",b:"1F1E8-1F1EB",k:[1,15],o:2},baby:{a:"Baby",b:"1F476",j:["child","boy","girl","toddler"],k:[23,4],o:2},atom_symbol:{a:"Atom Symbol",b:"269B-FE0F",c:"269B",j:["science","physics","chemistry"],k:[53,48],o:2},fishing_pole_and_fish:{a:"Fishing Pole and Fish",b:"1F3A3",j:["food","hobby","summer"],k:[8,9],o:2},hedgehog:{a:"Hedgehog",b:"1F994",k:[42,38],o:5},face_with_head_bandage:{a:"Face with Head-Bandage",b:"1F915",j:["injured","clumsy","bandage","hurt"],k:[37,28],o:2},mega:{a:"Cheering Megaphone",b:"1F4E3",j:["sound","speaker","volume"],k:[27,0],o:2},nauseated_face:{a:"Nauseated Face",b:"1F922",j:["face","vomit","gross","green","sick","throw up","ill"],k:[38,19],o:4},child:{a:"Child",b:"1F9D2",k:[48,16],o:5},"flag-cg":{a:"Congo - Brazzaville Flag",b:"1F1E8-1F1EC",k:[1,16],o:2},bat:{a:"Bat",b:"1F987",j:["animal","nature","blind","vampire"],k:[42,25],o:4},diving_mask:{a:"Diving Mask",b:"1F93F",k:[41,15],o:12},burrito:{a:"Burrito",b:"1F32F",j:["food","mexican"],k:[6,7],o:2},postal_horn:{a:"Postal Horn",b:"1F4EF",j:["instrument","music"],k:[27,12],o:2},night_with_stars:{a:"Night with Stars",b:"1F303",j:["evening","city","downtown"],k:[5,22],o:2},om_symbol:{a:"Om Symbol",b:"1F549-FE0F",c:"1F549",k:[28,33],o:2},star_of_david:{a:"Star of David",b:"2721-FE0F",c:"2721",j:["judaism"],k:[55,15],o:2},boy:{a:"Boy",b:"1F466",j:["man","male","guy","teenager"],k:[14,26],o:2},bell:{a:"Bell",b:"1F514",j:["sound","notification","christmas","xmas","chime"],k:[27,48],o:2},"flag-ch":{a:"Switzerland Flag",b:"1F1E8-1F1ED",k:[1,17],o:2},running_shirt_with_sash:{a:"Running Shirt with Sash",b:"1F3BD",j:["play","pageant"],k:[8,35],o:2},stuffed_flatbread:{a:"Stuffed Flatbread",b:"1F959",j:["food","flatbread","stuffed","gyro"],k:[41,40],o:4},bear:{a:"Bear Face",b:"1F43B",j:["animal","nature","wild"],k:[12,31],o:2},cityscape:{a:"Cityscape",b:"1F3D9-FE0F",c:"1F3D9",j:["photo","night life","urban"],k:[10,44],o:2},face_vomiting:{a:"Face with Open Mouth Vomiting",b:"1F92E",k:[38,48],n:["face_with_open_mouth_vomiting"],o:5},wheel_of_dharma:{a:"Wheel of Dharma",b:"2638-FE0F",c:"2638",j:["hinduism","buddhism","sikhism","jainism"],k:[53,15],o:2},ski:{a:"Ski and Ski Boot",b:"1F3BF",j:["sports","winter","cold","snow"],k:[8,37],o:2},girl:{a:"Girl",b:"1F467",j:["female","woman","teenager"],k:[14,32],o:2},falafel:{a:"Falafel",b:"1F9C6",k:[44,14],o:12},sneezing_face:{a:"Sneezing Face",b:"1F927",j:["face","gesundheit","sneeze","sick","allergy"],k:[38,41],o:4},no_bell:{a:"Bell with Cancellation Stroke",b:"1F515",j:["sound","volume","mute","quiet","silent"],k:[27,49],o:2},koala:{a:"Koala",b:"1F428",j:["animal","nature"],k:[12,12],o:2},sunrise_over_mountains:{a:"Sunrise over Mountains",b:"1F304",j:["view","vacation","photo"],k:[5,23],o:2},"flag-ci":{a:"Côte D’ivoire Flag",b:"1F1E8-1F1EE",k:[1,18],o:2},sunrise:{a:"Sunrise",b:"1F305",j:["morning","view","vacation","photo"],k:[5,24],o:2},yin_yang:{a:"Yin Yang",b:"262F-FE0F",c:"262F",j:["balance"],k:[53,14],o:2},adult:{a:"Adult",b:"1F9D1",k:[48,10],o:5},hot_face:{a:"Overheated Face",b:"1F975",k:[42,10],o:11},musical_score:{a:"Musical Score",b:"1F3BC",j:["treble","clef","compose"],k:[8,34],o:2},sled:{a:"Sled",b:"1F6F7",k:[36,56],o:5},egg:{a:"Egg",b:"1F95A",j:["food","chicken","breakfast"],k:[41,41],o:4},panda_face:{a:"Panda Face",b:"1F43C",j:["animal","nature","panda"],k:[12,32],o:2},"flag-ck":{a:"Cook Islands Flag",b:"1F1E8-1F1F0",k:[1,19],o:2},"flag-cl":{a:"Chile Flag",b:"1F1E8-1F1F1",k:[1,20],o:2},sloth:{a:"Sloth",b:"1F9A5",k:[42,53],o:12},latin_cross:{a:"Latin Cross",b:"271D-FE0F",c:"271D",j:["christianity"],k:[55,14],o:2},curling_stone:{a:"Curling Stone",b:"1F94C",k:[41,27],o:5},cold_face:{a:"Freezing Face",b:"1F976",k:[42,11],o:11},fried_egg:{a:"Cooking",b:"1F373",j:["food","breakfast","kitchen","egg"],k:[7,18],n:["cooking"],o:2},city_sunset:{a:"Cityscape at Dusk",b:"1F306",j:["photo","evening","sky","buildings"],k:[5,25],o:2},musical_note:{a:"Musical Note",b:"1F3B5",j:["score","tone","sound"],k:[8,27],o:2},"flag-cm":{a:"Cameroon Flag",b:"1F1E8-1F1F2",k:[1,21],o:2},notes:{a:"Multiple Musical Notes",b:"1F3B6",j:["music","score"],k:[8,28],o:2},woozy_face:{a:"Face with Uneven Eyes and Wavy Mouth",b:"1F974",k:[42,9],o:11},dart:{a:"Direct Hit",b:"1F3AF",j:["game","play","bar"],k:[8,21],o:2},orthodox_cross:{a:"Orthodox Cross",b:"2626-FE0F",c:"2626",j:["suppedaneum","religion"],k:[53,11],o:2},shallow_pan_of_food:{a:"Shallow Pan of Food",b:"1F958",j:["food","cooking","casserole","paella"],k:[41,39],o:4},otter:{a:"Otter",b:"1F9A6",k:[42,54],o:12},man:{a:"Man",b:"1F468",j:["mustache","father","dad","guy","classy","sir","moustache"],k:[17,22],o:2},city_sunrise:{a:"Sunset over Buildings",b:"1F307",j:["photo","good morning","dawn"],k:[5,26],o:2},bearded_person:{a:"Bearded Person",b:"1F9D4",k:[48,28],o:5},skunk:{a:"Skunk",b:"1F9A8",k:[42,56],o:12},stew:{a:"Pot of Food",b:"1F372",j:["food","meat","soup"],k:[7,17],o:2},cn:{a:"China Flag",b:"1F1E8-1F1F3",j:["china","chinese","prc","flag","country","nation","banner"],k:[1,22],n:["flag-cn"],o:2},studio_microphone:{a:"Studio Microphone",b:"1F399-FE0F",c:"1F399",j:["sing","recording","artist","talkshow"],k:[8,1],o:2},star_and_crescent:{a:"Star and Crescent",b:"262A-FE0F",c:"262A",j:["islam"],k:[53,12],o:2},"yo-yo":{a:"Yo-Yo",b:"1FA80",k:[52,1],o:12},bridge_at_night:{a:"Bridge at Night",b:"1F309",j:["photo","sanfrancisco"],k:[5,28],o:2},dizzy_face:{a:"Dizzy Face",b:"1F635",j:["spent","unconscious","xox","dizzy"],k:[31,31],o:2},red_haired_man:{a:"Red Haired Man",b:"1F468-200D-1F9B0",k:[16,23],o:11},kite:{a:"Kite",b:"1FA81",k:[52,2],o:12},bowl_with_spoon:{a:"Bowl with Spoon",b:"1F963",k:[41,50],o:5},"flag-co":{a:"Colombia Flag",b:"1F1E8-1F1F4",k:[1,23],o:2},peace_symbol:{a:"Peace Symbol",b:"262E-FE0F",c:"262E",j:["hippie"],k:[53,13],o:2},kangaroo:{a:"Kangaroo",b:"1F998",k:[42,42],o:11},hotsprings:{a:"Hot Springs",b:"2668-FE0F",c:"2668",j:["bath","warm","relax"],k:[53,37],o:2},exploding_head:{a:"Shocked Face with Exploding Head",b:"1F92F",k:[38,49],n:["shocked_face_with_exploding_head"],o:5},level_slider:{a:"Level Slider",b:"1F39A-FE0F",c:"1F39A",j:["scale"],k:[8,2],o:2},badger:{a:"Badger",b:"1F9A1",k:[42,51],o:11},"8ball":{a:"Billiards",b:"1F3B1",j:["pool","hobby","game","luck","magic"],k:[8,23],o:2},curly_haired_man:{a:"Curly Haired Man",b:"1F468-200D-1F9B1",k:[16,29],o:11},"flag-cp":{a:"Clipperton Island Flag",b:"1F1E8-1F1F5",k:[1,24],o:2},carousel_horse:{a:"Carousel Horse",b:"1F3A0",j:["photo","carnival"],k:[8,6],o:2},face_with_cowboy_hat:{a:"Face with Cowboy Hat",b:"1F920",k:[38,17],o:4},menorah_with_nine_branches:{a:"Menorah with Nine Branches",b:"1F54E",k:[28,38],o:2},green_salad:{a:"Green Salad",b:"1F957",j:["food","healthy","lettuce"],k:[41,38],o:4},control_knobs:{a:"Control Knobs",b:"1F39B-FE0F",c:"1F39B",j:["dial"],k:[8,3],o:2},popcorn:{a:"Popcorn",b:"1F37F",j:["food","movie theater","films","snack"],k:[7,30],o:2},six_pointed_star:{a:"Six Pointed Star with Middle Dot",b:"1F52F",j:["purple-square","religion","jewish","hexagram"],k:[28,18],o:2},feet:{a:"Paw Prints",b:"1F43E",k:[12,34],n:["paw_prints"],o:2},ferris_wheel:{a:"Ferris Wheel",b:"1F3A1",j:["photo","carnival","londoneye"],k:[8,7],o:2},microphone:{a:"Microphone",b:"1F3A4",j:["sound","music","PA","sing","talkshow"],k:[8,10],o:2},crystal_ball:{a:"Crystal Ball",b:"1F52E",j:["disco","party","magic","circus","fortune_teller"],k:[28,17],o:2},partying_face:{a:"Face with Party Horn and Party Hat",b:"1F973",k:[42,8],o:11},"flag-cr":{a:"Costa Rica Flag",b:"1F1E8-1F1F7",k:[1,25],o:2},white_haired_man:{a:"White Haired Man",b:"1F468-200D-1F9B3",k:[16,41],o:11},headphones:{a:"Headphone",b:"1F3A7",j:["music","score","gadgets"],k:[8,13],o:2},bald_man:{a:"Bald Man",b:"1F468-200D-1F9B2",k:[16,35],o:11},sunglasses:{a:"Smiling Face with Sunglasses",b:"1F60E",j:["face","cool","smile","summer","beach","sunglass"],k:[30,49],l:["8)"],o:2},butter:{a:"Butter",b:"1F9C8",k:[44,16],o:12},roller_coaster:{a:"Roller Coaster",b:"1F3A2",j:["carnival","playground","photo","fun"],k:[8,8],o:2},turkey:{a:"Turkey",b:"1F983",j:["animal","bird"],k:[42,21],o:2},nazar_amulet:{a:"Nazar Amulet",b:"1F9FF",k:[51,50],o:11},"flag-cu":{a:"Cuba Flag",b:"1F1E8-1F1FA",k:[1,26],o:2},aries:{a:"Aries",b:"2648",j:["sign","purple-square","zodiac","astrology"],k:[53,20],o:2},"flag-cv":{a:"Cape Verde Flag",b:"1F1E8-1F1FB",k:[1,27],o:2},barber:{a:"Barber Pole",b:"1F488",j:["hair","salon","style"],k:[25,18],o:2},taurus:{a:"Taurus",b:"2649",j:["purple-square","sign","zodiac","astrology"],k:[53,21],o:2},salt:{a:"Salt Shaker",b:"1F9C2",k:[44,10],o:11},woman:{a:"Woman",b:"1F469",j:["female","girls","lady"],k:[20,9],o:2},video_game:{a:"Video Game",b:"1F3AE",j:["play","console","PS4","controller"],k:[8,20],o:2},chicken:{a:"Chicken",b:"1F414",j:["animal","cluck","nature","bird"],k:[11,48],o:2},radio:{a:"Radio",b:"1F4FB",j:["communication","music","podcast","program"],k:[27,24],o:2},nerd_face:{a:"Nerd Face",b:"1F913",j:["face","nerdy","geek","dork"],k:[37,26],o:2},red_haired_woman:{a:"Red Haired Woman",b:"1F469-200D-1F9B0",k:[19,8],o:11},circus_tent:{a:"Circus Tent",b:"1F3AA",j:["festival","carnival","party"],k:[8,16],o:2},face_with_monocle:{a:"Face with Monocle",b:"1F9D0",k:[45,16],o:5},canned_food:{a:"Canned Food",b:"1F96B",k:[42,1],o:5},"flag-cw":{a:"Curaçao Flag",b:"1F1E8-1F1FC",k:[1,28],o:2},gemini:{a:"Gemini",b:"264A",j:["sign","zodiac","purple-square","astrology"],k:[53,22],o:2},saxophone:{a:"Saxophone",b:"1F3B7",j:["music","instrument","jazz","blues"],k:[8,29],o:2},rooster:{a:"Rooster",b:"1F413",j:["animal","nature","chicken"],k:[11,47],o:2},joystick:{a:"Joystick",b:"1F579-FE0F",c:"1F579",j:["game","play"],k:[29,36],o:2},guitar:{a:"Guitar",b:"1F3B8",j:["music","instrument"],k:[8,30],o:2},slot_machine:{a:"Slot Machine",b:"1F3B0",j:["bet","gamble","vegas","fruit machine","luck","casino"],k:[8,22],o:2},bento:{a:"Bento Box",b:"1F371",j:["food","japanese","box"],k:[7,16],o:2},steam_locomotive:{a:"Steam Locomotive",b:"1F682",j:["transportation","vehicle","train"],k:[34,1],o:2},confused:{a:"Confused Face",b:"1F615",j:["face","indifference","huh","weird","hmmm",":/"],k:[30,56],l:[":\\",":-\\",":/",":-/"],o:2},"flag-cx":{a:"Christmas Island Flag",b:"1F1E8-1F1FD",k:[1,29],o:2},hatching_chick:{a:"Hatching Chick",b:"1F423",j:["animal","chicken","egg","born","baby","bird"],k:[12,7],o:2},cancer:{a:"Cancer",b:"264B",j:["sign","zodiac","purple-square","astrology"],k:[53,23],o:2},"flag-cy":{a:"Cyprus Flag",b:"1F1E8-1F1FE",k:[1,30],o:2},worried:{a:"Worried Face",b:"1F61F",j:["face","concern","nervous",":("],k:[31,9],o:2},railway_car:{a:"Railway Car",b:"1F683",j:["transportation","vehicle"],k:[34,2],o:2},leo:{a:"Leo",b:"264C",j:["sign","purple-square","zodiac","astrology"],k:[53,24],o:2},curly_haired_woman:{a:"Curly Haired Woman",b:"1F469-200D-1F9B1",k:[19,14],o:11},baby_chick:{a:"Baby Chick",b:"1F424",j:["animal","chicken","bird"],k:[12,8],o:2},musical_keyboard:{a:"Musical Keyboard",b:"1F3B9",j:["piano","instrument","compose"],k:[8,31],o:2},game_die:{a:"Game Die",b:"1F3B2",j:["dice","random","tabletop","play","luck"],k:[8,24],o:2},rice_cracker:{a:"Rice Cracker",b:"1F358",j:["food","japanese"],k:[6,48],o:2},virgo:{a:"Virgo",b:"264D",j:["sign","zodiac","purple-square","astrology"],k:[53,25],o:2},"flag-cz":{a:"Czechia Flag",b:"1F1E8-1F1FF",k:[1,31],o:2},rice_ball:{a:"Rice Ball",b:"1F359",j:["food","japanese"],k:[6,49],o:2},hatched_chick:{a:"Front-Facing Baby Chick",b:"1F425",j:["animal","chicken","baby","bird"],k:[12,9],o:2},jigsaw:{a:"Jigsaw Puzzle Piece",b:"1F9E9",k:[51,28],o:11},trumpet:{a:"Trumpet",b:"1F3BA",j:["music","brass"],k:[8,32],o:2},slightly_frowning_face:{a:"Slightly Frowning Face",b:"1F641",j:["face","frowning","disappointed","sad","upset"],k:[31,43],o:2},bullettrain_side:{a:"High-Speed Train",b:"1F684",j:["transportation","vehicle"],k:[34,3],o:2},libra:{a:"Libra",b:"264E",j:["sign","purple-square","zodiac","astrology"],k:[53,26],o:2},de:{a:"Germany Flag",b:"1F1E9-1F1EA",j:["german","nation","flag","country","banner"],k:[1,32],n:["flag-de"],o:2},rice:{a:"Cooked Rice",b:"1F35A",j:["food","china","asian"],k:[6,50],o:2},violin:{a:"Violin",b:"1F3BB",j:["music","instrument","orchestra","symphony"],k:[8,33],o:2},white_haired_woman:{a:"White Haired Woman",b:"1F469-200D-1F9B3",k:[19,26],o:11},bird:{a:"Bird",b:"1F426",j:["animal","nature","fly","tweet","spring"],k:[12,10],o:2},white_frowning_face:{a:"White Frowning Face",b:"2639-FE0F",c:"2639",k:[53,16],o:2},bullettrain_front:{a:"High-Speed Train with Bullet Nose",b:"1F685",j:["transportation","vehicle","speed","fast","public","travel"],k:[34,4],o:2},teddy_bear:{a:"Teddy Bear",b:"1F9F8",k:[51,43],o:11},spades:{a:"Black Spade Suit",b:"2660-FE0F",c:"2660",j:["poker","cards","suits","magic"],k:[53,33],o:2},banjo:{a:"Banjo",b:"1FA95",k:[52,9],o:12},train2:{a:"Train",b:"1F686",j:["transportation","vehicle"],k:[34,5],o:2},scorpius:{a:"Scorpius",b:"264F",j:["sign","zodiac","purple-square","astrology","scorpio"],k:[53,27],o:2},curry:{a:"Curry and Rice",b:"1F35B",j:["food","spicy","hot","indian"],k:[6,51],o:2},open_mouth:{a:"Face with Open Mouth",b:"1F62E",j:["face","surprise","impressed","wow","whoa",":O"],k:[31,24],l:[":o",":-o",":O",":-O"],o:2},"flag-dg":{a:"Diego Garcia Flag",b:"1F1E9-1F1EC",k:[1,33],o:2},penguin:{a:"Penguin",b:"1F427",j:["animal","nature"],k:[12,11],o:2},hearts:{a:"Black Heart Suit",b:"2665-FE0F",c:"2665",j:["poker","cards","magic","suits"],k:[53,35],o:2},ramen:{a:"Steaming Bowl",b:"1F35C",j:["food","japanese","noodle","chopsticks"],k:[6,52],o:2},sagittarius:{a:"Sagittarius",b:"2650",j:["sign","zodiac","purple-square","astrology"],k:[53,28],o:2},bald_woman:{a:"Bald Woman",b:"1F469-200D-1F9B2",k:[19,20],o:11},dove_of_peace:{a:"Dove of Peace",b:"1F54A-FE0F",c:"1F54A",k:[28,34],o:2},hushed:{a:"Hushed Face",b:"1F62F",j:["face","woo","shh"],k:[31,25],o:2},metro:{a:"Metro",b:"1F687",j:["transportation","blue-square","mrt","underground","tube"],k:[34,6],o:2},"flag-dj":{a:"Djibouti Flag",b:"1F1E9-1F1EF",k:[1,34],o:2},drum_with_drumsticks:{a:"Drum with Drumsticks",b:"1F941",k:[41,17],o:4},spaghetti:{a:"Spaghetti",b:"1F35D",j:["food","italian","noodle"],k:[6,53],o:2},eagle:{a:"Eagle",b:"1F985",j:["animal","nature","bird"],k:[42,23],o:4},astonished:{a:"Astonished Face",b:"1F632",j:["face","xox","surprised","poisoned"],k:[31,28],o:2},capricorn:{a:"Capricorn",b:"2651",j:["sign","zodiac","purple-square","astrology"],k:[53,29],o:2},light_rail:{a:"Light Rail",b:"1F688",j:["transportation","vehicle"],k:[34,7],o:2},"flag-dk":{a:"Denmark Flag",b:"1F1E9-1F1F0",k:[1,35],o:2},iphone:{a:"Mobile Phone",b:"1F4F1",j:["technology","apple","gadgets","dial"],k:[27,14],o:2},diamonds:{a:"Black Diamond Suit",b:"2666-FE0F",c:"2666",j:["poker","cards","magic","suits"],k:[53,36],o:2},clubs:{a:"Black Club Suit",b:"2663-FE0F",c:"2663",j:["poker","cards","magic","suits"],k:[53,34],o:2},aquarius:{a:"Aquarius",b:"2652",j:["sign","purple-square","zodiac","astrology"],k:[53,30],o:2},sweet_potato:{a:"Roasted Sweet Potato",b:"1F360",j:["food","nature"],k:[6,56],o:2},"flag-dm":{a:"Dominica Flag",b:"1F1E9-1F1F2",k:[1,36],o:2},duck:{a:"Duck",b:"1F986",j:["animal","nature","bird","mallard"],k:[42,24],o:4},calling:{a:"Mobile Phone with Rightwards Arrow at Left",b:"1F4F2",j:["iphone","incoming"],k:[27,15],o:2},station:{a:"Station",b:"1F689",j:["transportation","vehicle","public"],k:[34,8],o:2},"blond-haired-woman":{a:"Blond Haired Woman",b:"1F471-200D-2640-FE0F",c:"1F471-200D-2640",k:[22,7],o:4},flushed:{a:"Flushed Face",b:"1F633",j:["face","blush","shy","flattered"],k:[31,29],o:2},pisces:{a:"Pisces",b:"2653",j:["purple-square","sign","zodiac","astrology"],k:[53,31],o:2},chess_pawn:{a:"Chess Pawn",b:"265F-FE0F",c:"265F",k:[53,32],o:11},"blond-haired-man":{obsoletes:"1F471",a:"Blond Haired Man",b:"1F471-200D-2642-FE0F",c:"1F471-200D-2642",k:[22,13],o:4},phone:{a:"Black Telephone",b:"260E-FE0F",c:"260E",j:["technology","communication","dial","telephone"],k:[52,54],n:["telephone"],o:2},oden:{a:"Oden",b:"1F362",j:["food","japanese"],k:[7,1],o:2},"flag-do":{a:"Dominican Republic Flag",b:"1F1E9-1F1F4",k:[1,37],o:2},tram:{a:"Tram",b:"1F68A",j:["transportation","vehicle"],k:[34,9],o:2},swan:{a:"Swan",b:"1F9A2",k:[42,52],o:11},pleading_face:{a:"Face with Pleading Eyes",b:"1F97A",k:[42,12],o:11},"flag-dz":{a:"Algeria Flag",b:"1F1E9-1F1FF",k:[1,38],o:2},monorail:{a:"Monorail",b:"1F69D",j:["transportation","vehicle"],k:[34,28],o:2},owl:{a:"Owl",b:"1F989",j:["animal","nature","bird","hoot"],k:[42,27],o:4},sushi:{a:"Sushi",b:"1F363",j:["food","fish","japanese","rice"],k:[7,2],o:2},telephone_receiver:{a:"Telephone Receiver",b:"1F4DE",j:["technology","communication","dial"],k:[26,52],o:2},black_joker:{a:"Playing Card Black Joker",b:"1F0CF",j:["poker","cards","game","play","magic"],k:[0,15],o:2},ophiuchus:{a:"Ophiuchus",b:"26CE",j:["sign","purple-square","constellation","astrology"],k:[54,4],o:2},frowning:{a:"Frowning Face with Open Mouth",b:"1F626",j:["face","aw","what"],k:[31,16],o:2},older_adult:{a:"Older Adult",b:"1F9D3",k:[48,22],o:5},"flag-ea":{a:"Ceuta & Melilla Flag",b:"1F1EA-1F1E6",k:[1,39],o:2},flamingo:{a:"Flamingo",b:"1F9A9",k:[43,0],o:12},pager:{a:"Pager",b:"1F4DF",j:["bbcall","oldschool","90s"],k:[26,53],o:2},mountain_railway:{a:"Mountain Railway",b:"1F69E",j:["transportation","vehicle"],k:[34,29],o:2},mahjong:{a:"Mahjong Tile Red Dragon",b:"1F004",j:["game","play","chinese","kanji"],k:[0,14],o:2},older_man:{a:"Older Man",b:"1F474",j:["human","male","men","old","elder","senior"],k:[22,49],o:2},twisted_rightwards_arrows:{a:"Twisted Rightwards Arrows",b:"1F500",j:["blue-square","shuffle","music","random"],k:[27,28],o:2},fried_shrimp:{a:"Fried Shrimp",b:"1F364",j:["food","animal","appetizer","summer"],k:[7,3],o:2},anguished:{a:"Anguished Face",b:"1F627",j:["face","stunned","nervous"],k:[31,17],l:["D:"],o:2},repeat:{a:"Clockwise Rightwards and Leftwards Open Circle Arrows",b:"1F501",j:["loop","record"],k:[27,29],o:2},fish_cake:{a:"Fish Cake with Swirl Design",b:"1F365",j:["food","japan","sea","beach","narutomaki","pink","swirl","kamaboko","surimi","ramen"],k:[7,4],o:2},fax:{a:"Fax Machine",b:"1F4E0",j:["communication","technology"],k:[26,54],o:2},older_woman:{a:"Older Woman",b:"1F475",j:["human","female","women","lady","old","elder","senior"],k:[22,55],o:2},"flag-ec":{a:"Ecuador Flag",b:"1F1EA-1F1E8",k:[1,40],o:2},peacock:{a:"Peacock",b:"1F99A",k:[42,44],o:11},fearful:{a:"Fearful Face",b:"1F628",j:["face","scared","terrified","nervous","oops","huh"],k:[31,18],o:2},train:{a:"Tram Car",b:"1F68B",j:["transportation","vehicle","carriage","public","travel"],k:[34,10],o:2},flower_playing_cards:{a:"Flower Playing Cards",b:"1F3B4",j:["game","sunset","red"],k:[8,26],o:2},repeat_one:{a:"Clockwise Rightwards and Leftwards Open Circle Arrows with Circled One Overlay",b:"1F502",j:["blue-square","loop"],k:[27,30],o:2},moon_cake:{a:"Moon Cake",b:"1F96E",k:[42,4],o:11},performing_arts:{a:"Performing Arts",b:"1F3AD",j:["acting","theater","drama"],k:[8,19],o:2},cold_sweat:{a:"Face with Open Mouth and Cold Sweat",b:"1F630",j:["face","nervous","sweat"],k:[31,26],o:2},"flag-ee":{a:"Estonia Flag",b:"1F1EA-1F1EA",k:[1,41],o:2},battery:{a:"Battery",b:"1F50B",j:["power","energy","sustain"],k:[27,39],o:2},parrot:{a:"Parrot",b:"1F99C",k:[42,46],o:11},bus:{a:"Bus",b:"1F68C",j:["car","vehicle","transportation"],k:[34,11],o:2},"flag-eg":{a:"Egypt Flag",b:"1F1EA-1F1EC",k:[1,42],o:2},arrow_forward:{a:"Black Right-Pointing Triangle",b:"25B6-FE0F",c:"25B6",j:["blue-square","right","direction","play"],k:[52,43],o:2},"man-frowning":{a:"Man Frowning",b:"1F64D-200D-2642-FE0F",c:"1F64D-200D-2642",k:[33,20],o:4},disappointed_relieved:{a:"Disappointed but Relieved Face",b:"1F625",j:["face","phew","sweat","nervous"],k:[31,15],o:2},electric_plug:{a:"Electric Plug",b:"1F50C",j:["charger","power"],k:[27,40],o:2},frame_with_picture:{a:"Frame with Picture",b:"1F5BC-FE0F",c:"1F5BC",k:[30,14],o:2},oncoming_bus:{a:"Oncoming Bus",b:"1F68D",j:["vehicle","transportation"],k:[34,12],o:2},dango:{a:"Dango",b:"1F361",j:["food","dessert","sweet","japanese","barbecue","meat"],k:[7,0],o:2},frog:{a:"Frog Face",b:"1F438",j:["animal","nature","croak","toad"],k:[12,28],o:2},computer:{a:"Personal Computer",b:"1F4BB",j:["technology","laptop","screen","display","monitor"],k:[26,17],o:2},art:{a:"Artist Palette",b:"1F3A8",j:["design","paint","draw","colors"],k:[8,14],o:2},"flag-eh":{a:"Western Sahara Flag",b:"1F1EA-1F1ED",k:[1,43],o:2},fast_forward:{a:"Black Right-Pointing Double Triangle",b:"23E9",j:["blue-square","play","speed","continue"],k:[52,26],o:2},cry:{a:"Crying Face",b:"1F622",j:["face","tears","sad","depressed","upset",":'("],k:[31,12],l:[":'("],m:":'(",o:2},"woman-frowning":{obsoletes:"1F64D",a:"Woman Frowning",b:"1F64D-200D-2640-FE0F",c:"1F64D-200D-2640",k:[33,14],o:4},trolleybus:{a:"Trolleybus",b:"1F68E",j:["bart","transportation","vehicle"],k:[34,13],o:2},crocodile:{a:"Crocodile",b:"1F40A",j:["animal","nature","reptile","lizard","alligator"],k:[11,38],o:2},dumpling:{a:"Dumpling",b:"1F95F",k:[41,46],o:5},black_right_pointing_double_triangle_with_vertical_bar:{a:"Black Right Pointing Double Triangle with Vertical Bar",b:"23ED-FE0F",c:"23ED",k:[52,30],o:2},desktop_computer:{a:"Desktop Computer",b:"1F5A5-FE0F",c:"1F5A5",j:["technology","computing","screen"],k:[30,10],o:2},turtle:{a:"Turtle",b:"1F422",j:["animal","slow","nature","tortoise"],k:[12,6],o:2},sob:{a:"Loudly Crying Face",b:"1F62D",j:["face","cry","tears","sad","upset","depressed"],k:[31,23],m:":'(",o:2},"flag-er":{a:"Eritrea Flag",b:"1F1EA-1F1F7",k:[1,44],o:2},thread:{a:"Spool of Thread",b:"1F9F5",k:[51,40],o:11},minibus:{a:"Minibus",b:"1F690",j:["vehicle","car","transportation"],k:[34,15],o:2},fortune_cookie:{a:"Fortune Cookie",b:"1F960",k:[41,47],o:5},yarn:{a:"Ball of Yarn",b:"1F9F6",k:[51,41],o:11},takeout_box:{a:"Takeout Box",b:"1F961",k:[41,48],o:5},"man-pouting":{a:"Man Pouting",b:"1F64E-200D-2642-FE0F",c:"1F64E-200D-2642",k:[33,38],o:4},printer:{a:"Printer",b:"1F5A8-FE0F",c:"1F5A8",j:["paper","ink"],k:[30,11],o:2},scream:{a:"Face Screaming in Fear",b:"1F631",j:["face","munch","scared","omg"],k:[31,27],o:2},es:{a:"Spain Flag",b:"1F1EA-1F1F8",j:["spain","flag","nation","country","banner"],k:[1,45],n:["flag-es"],o:2},ambulance:{a:"Ambulance",b:"1F691",j:["health","911","hospital"],k:[34,16],o:2},black_right_pointing_triangle_with_double_vertical_bar:{a:"Black Right Pointing Triangle with Double Vertical Bar",b:"23EF-FE0F",c:"23EF",k:[52,32],o:2},lizard:{a:"Lizard",b:"1F98E",j:["animal","nature","reptile"],k:[42,32],o:4},"flag-et":{a:"Ethiopia Flag",b:"1F1EA-1F1F9",k:[1,46],o:2},keyboard:{a:"Keyboard",b:"2328-FE0F",c:"2328",j:["technology","computer","type","input","text"],k:[52,24],o:2},crab:{a:"Crab",b:"1F980",j:["animal","crustacean"],k:[42,18],o:2},confounded:{a:"Confounded Face",b:"1F616",j:["face","confused","sick","unwell","oops",":S"],k:[31,0],o:2},snake:{a:"Snake",b:"1F40D",j:["animal","evil","nature","hiss","python"],k:[11,41],o:2},"woman-pouting":{obsoletes:"1F64E",a:"Woman Pouting",b:"1F64E-200D-2640-FE0F",c:"1F64E-200D-2640",k:[33,32],o:4},arrow_backward:{a:"Black Left-Pointing Triangle",b:"25C0-FE0F",c:"25C0",j:["blue-square","left","direction"],k:[52,44],o:2},fire_engine:{a:"Fire Engine",b:"1F692",j:["transportation","cars","vehicle"],k:[34,17],o:2},rewind:{a:"Black Left-Pointing Double Triangle",b:"23EA",j:["play","blue-square"],k:[52,27],o:2},three_button_mouse:{a:"Three Button Mouse",b:"1F5B1-FE0F",c:"1F5B1",k:[30,12],o:2},police_car:{a:"Police Car",b:"1F693",j:["vehicle","cars","transportation","law","legal","enforcement"],k:[34,18],o:2},dragon_face:{a:"Dragon Face",b:"1F432",j:["animal","myth","nature","chinese","green"],k:[12,22],o:2},persevere:{a:"Persevering Face",b:"1F623",j:["face","sick","no","upset","oops"],k:[31,13],o:2},lobster:{a:"Lobster",b:"1F99E",k:[42,48],o:11},"flag-eu":{a:"European Union Flag",b:"1F1EA-1F1FA",k:[1,47],o:2},disappointed:{a:"Disappointed Face",b:"1F61E",j:["face","sad","upset","depressed",":("],k:[31,8],l:["):",":(",":-("],m:":(",o:2},shrimp:{a:"Shrimp",b:"1F990",j:["animal","ocean","nature","seafood"],k:[42,34],o:4},dragon:{a:"Dragon",b:"1F409",j:["animal","myth","nature","chinese","green"],k:[11,37],o:2},"man-gesturing-no":{a:"Man Gesturing No",b:"1F645-200D-2642-FE0F",c:"1F645-200D-2642",k:[31,53],o:4},"flag-fi":{a:"Finland Flag",b:"1F1EB-1F1EE",k:[1,48],o:2},trackball:{a:"Trackball",b:"1F5B2-FE0F",c:"1F5B2",j:["technology","trackpad"],k:[30,13],o:2},black_left_pointing_double_triangle_with_vertical_bar:{a:"Black Left Pointing Double Triangle with Vertical Bar",b:"23EE-FE0F",c:"23EE",k:[52,31],o:2},oncoming_police_car:{a:"Oncoming Police Car",b:"1F694",j:["vehicle","law","legal","enforcement","911"],k:[34,19],o:2},minidisc:{a:"Minidisc",b:"1F4BD",j:["technology","record","data","disk","90s"],k:[26,19],o:2},sweat:{a:"Face with Cold Sweat",b:"1F613",j:["face","hot","sad","tired","exercise"],k:[30,54],o:2},squid:{a:"Squid",b:"1F991",j:["animal","nature","ocean","sea"],k:[42,35],o:4},sauropod:{a:"Sauropod",b:"1F995",k:[42,39],o:5},arrow_up_small:{a:"Up-Pointing Small Red Triangle",b:"1F53C",j:["blue-square","triangle","direction","point","forward","top"],k:[28,31],o:2},"flag-fj":{a:"Fiji Flag",b:"1F1EB-1F1EF",k:[1,49],o:2},"woman-gesturing-no":{obsoletes:"1F645",a:"Woman Gesturing No",b:"1F645-200D-2640-FE0F",c:"1F645-200D-2640",k:[31,47],o:4},taxi:{a:"Taxi",b:"1F695",j:["uber","vehicle","cars","transportation"],k:[34,20],o:2},"flag-fk":{a:"Falkland Islands Flag",b:"1F1EB-1F1F0",k:[1,50],o:2},floppy_disk:{a:"Floppy Disk",b:"1F4BE",j:["oldschool","technology","save","90s","80s"],k:[26,20],o:2},"t-rex":{a:"T-Rex",b:"1F996",k:[42,40],o:5},oyster:{a:"Oyster",b:"1F9AA",k:[43,1],o:12},arrow_double_up:{a:"Black Up-Pointing Double Triangle",b:"23EB",j:["blue-square","direction","top"],k:[52,28],o:2},oncoming_taxi:{a:"Oncoming Taxi",b:"1F696",j:["vehicle","cars","uber"],k:[34,21],o:2},weary:{a:"Weary Face",b:"1F629",j:["face","tired","sleepy","sad","frustrated","upset"],k:[31,19],o:2},"man-gesturing-ok":{a:"Man Gesturing Ok",b:"1F646-200D-2642-FE0F",c:"1F646-200D-2642",k:[32,14],o:4},arrow_down_small:{a:"Down-Pointing Small Red Triangle",b:"1F53D",j:["blue-square","direction","bottom"],k:[28,32],o:2},tired_face:{a:"Tired Face",b:"1F62B",j:["sick","whine","upset","frustrated"],k:[31,21],o:2},car:{a:"Automobile",b:"1F697",k:[34,22],n:["red_car"],o:2},icecream:{a:"Soft Ice Cream",b:"1F366",j:["food","hot","dessert","summer"],k:[7,5],o:2},cd:{a:"Optical Disc",b:"1F4BF",j:["technology","dvd","disk","disc","90s"],k:[26,21],o:2},whale:{a:"Spouting Whale",b:"1F433",j:["animal","nature","sea","ocean"],k:[12,23],o:2},"flag-fm":{a:"Micronesia Flag",b:"1F1EB-1F1F2",k:[1,51],o:2},oncoming_automobile:{a:"Oncoming Automobile",b:"1F698",j:["car","vehicle","transportation"],k:[34,23],o:2},arrow_double_down:{a:"Black Down-Pointing Double Triangle",b:"23EC",j:["blue-square","direction","bottom"],k:[52,29],o:2},"woman-gesturing-ok":{obsoletes:"1F646",a:"Woman Gesturing Ok",b:"1F646-200D-2640-FE0F",c:"1F646-200D-2640",k:[32,8],o:4},yawning_face:{a:"Yawning Face",b:"1F971",k:[42,7],o:12},dvd:{a:"Dvd",b:"1F4C0",j:["cd","disk","disc"],k:[26,22],o:2},whale2:{a:"Whale",b:"1F40B",j:["animal","nature","sea","ocean"],k:[11,39],o:2},"flag-fo":{a:"Faroe Islands Flag",b:"1F1EB-1F1F4",k:[1,52],o:2},shaved_ice:{a:"Shaved Ice",b:"1F367",j:["hot","dessert","summer"],k:[7,6],o:2},double_vertical_bar:{a:"Double Vertical Bar",b:"23F8-FE0F",c:"23F8",k:[52,37],o:2},dolphin:{a:"Dolphin",b:"1F42C",j:["animal","nature","fish","sea","ocean","flipper","fins","beach"],k:[12,16],n:["flipper"],o:2},blue_car:{a:"Recreational Vehicle",b:"1F699",j:["transportation","vehicle"],k:[34,24],o:2},ice_cream:{a:"Ice Cream",b:"1F368",j:["food","hot","dessert"],k:[7,7],o:2},fr:{a:"France Flag",b:"1F1EB-1F1F7",j:["banner","flag","nation","france","french","country"],k:[1,53],n:["flag-fr"],o:2},triumph:{a:"Face with Look of Triumph",b:"1F624",j:["face","gas","phew","proud","pride"],k:[31,14],o:2},abacus:{a:"Abacus",b:"1F9EE",k:[51,33],o:11},"man-tipping-hand":{a:"Man Tipping Hand",b:"1F481-200D-2642-FE0F",c:"1F481-200D-2642",k:[23,53],o:4},doughnut:{a:"Doughnut",b:"1F369",j:["food","dessert","snack","sweet","donut"],k:[7,8],o:2},fish:{a:"Fish",b:"1F41F",j:["animal","food","nature"],k:[12,3],o:2},truck:{a:"Delivery Truck",b:"1F69A",j:["cars","transportation"],k:[34,25],o:2},movie_camera:{a:"Movie Camera",b:"1F3A5",j:["film","record"],k:[8,11],o:2},"flag-ga":{a:"Gabon Flag",b:"1F1EC-1F1E6",k:[1,54],o:2},rage:{a:"Pouting Face",b:"1F621",j:["angry","mad","hate","despise"],k:[31,11],o:2},black_square_for_stop:{a:"Black Square for Stop",b:"23F9-FE0F",c:"23F9",k:[52,38],o:2},articulated_lorry:{a:"Articulated Lorry",b:"1F69B",j:["vehicle","cars","transportation","express"],k:[34,26],o:2},angry:{a:"Angry Face",b:"1F620",j:["mad","face","annoyed","frustrated"],k:[31,10],l:[">:(",">:-("],o:2},cookie:{a:"Cookie",b:"1F36A",j:["food","snack","oreo","chocolate","sweet","dessert"],k:[7,9],o:2},gb:{a:"United Kingdom Flag",b:"1F1EC-1F1E7",k:[1,55],n:["uk","flag-gb"],o:2},tropical_fish:{a:"Tropical Fish",b:"1F420",j:["animal","swim","ocean","beach","nemo"],k:[12,4],o:2},"woman-tipping-hand":{obsoletes:"1F481",a:"Woman Tipping Hand",b:"1F481-200D-2640-FE0F",c:"1F481-200D-2640",k:[23,47],o:4},black_circle_for_record:{a:"Black Circle for Record",b:"23FA-FE0F",c:"23FA",k:[52,39],o:2},film_frames:{a:"Film Frames",b:"1F39E-FE0F",c:"1F39E",k:[8,4],o:2},film_projector:{a:"Film Projector",b:"1F4FD-FE0F",c:"1F4FD",j:["video","tape","record","movie"],k:[27,26],o:2},"flag-gd":{a:"Grenada Flag",b:"1F1EC-1F1E9",k:[1,56],o:2},blowfish:{a:"Blowfish",b:"1F421",j:["animal","nature","food","sea","ocean"],k:[12,5],o:2},face_with_symbols_on_mouth:{a:"Serious Face with Symbols Covering Mouth",b:"1F92C",k:[38,46],n:["serious_face_with_symbols_covering_mouth"],o:5},birthday:{a:"Birthday Cake",b:"1F382",j:["food","dessert","cake"],k:[7,33],o:2},eject:{a:"Eject",b:"23CF-FE0F",c:"23CF",k:[52,25],o:2},tractor:{a:"Tractor",b:"1F69C",j:["vehicle","car","farming","agriculture"],k:[34,27],o:2},"flag-ge":{a:"Georgia Flag",b:"1F1EC-1F1EA",k:[2,0],o:2},smiling_imp:{a:"Smiling Face with Horns",b:"1F608",j:["devil","horns"],k:[30,43],o:2},racing_car:{a:"Racing Car",b:"1F3CE-FE0F",c:"1F3CE",j:["sports","race","fast","formula","f1"],k:[10,33],o:2},cinema:{a:"Cinema",b:"1F3A6",j:["blue-square","record","film","movie","curtain","stage","theater"],k:[8,12],o:2},clapper:{a:"Clapper Board",b:"1F3AC",j:["movie","film","record"],k:[8,18],o:2},shark:{a:"Shark",b:"1F988",j:["animal","nature","fish","sea","ocean","jaws","fins","beach"],k:[42,26],o:4},cake:{a:"Shortcake",b:"1F370",j:["food","dessert"],k:[7,15],o:2},"man-raising-hand":{a:"Man Raising Hand",b:"1F64B-200D-2642-FE0F",c:"1F64B-200D-2642",k:[32,53],o:4},octopus:{a:"Octopus",b:"1F419",j:["animal","creature","ocean","sea","nature","beach"],k:[11,54],o:2},"woman-raising-hand":{obsoletes:"1F64B",a:"Woman Raising Hand",b:"1F64B-200D-2640-FE0F",c:"1F64B-200D-2640",k:[32,47],o:4},"flag-gf":{a:"French Guiana Flag",b:"1F1EC-1F1EB",k:[2,1],o:2},tv:{a:"Television",b:"1F4FA",j:["technology","program","oldschool","show","television"],k:[27,23],o:2},imp:{a:"Imp",b:"1F47F",j:["devil","angry","horns"],k:[23,45],o:2},cupcake:{a:"Cupcake",b:"1F9C1",k:[44,9],o:11},racing_motorcycle:{a:"Racing Motorcycle",b:"1F3CD-FE0F",c:"1F3CD",k:[10,32],o:2},low_brightness:{a:"Low Brightness Symbol",b:"1F505",j:["sun","afternoon","warm","summer"],k:[27,33],o:2},shell:{a:"Spiral Shell",b:"1F41A",j:["nature","sea","beach"],k:[11,55],o:2},"flag-gg":{a:"Guernsey Flag",b:"1F1EC-1F1EC",k:[2,2],o:2},high_brightness:{a:"High Brightness Symbol",b:"1F506",j:["sun","light"],k:[27,34],o:2},deaf_person:{a:"Deaf Person",b:"1F9CF",k:[45,10],o:12},skull:{a:"Skull",b:"1F480",j:["dead","skeleton","creepy","death"],k:[23,46],o:2},motor_scooter:{a:"Motor Scooter",b:"1F6F5",j:["vehicle","vespa","sasha"],k:[36,54],o:4},camera:{a:"Camera",b:"1F4F7",j:["gadgets","photography"],k:[27,20],o:2},pie:{a:"Pie",b:"1F967",k:[41,54],o:5},"flag-gh":{a:"Ghana Flag",b:"1F1EC-1F1ED",k:[2,3],o:2},deaf_man:{a:"Deaf Man",b:"1F9CF-200D-2642-FE0F",c:"1F9CF-200D-2642",k:[45,4],o:12},skull_and_crossbones:{a:"Skull and Crossbones",b:"2620-FE0F",c:"2620",j:["poison","danger","deadly","scary","death","pirate","evil"],k:[53,8],o:2},camera_with_flash:{a:"Camera with Flash",b:"1F4F8",k:[27,21],o:2},signal_strength:{a:"Antenna with Bars",b:"1F4F6",j:["blue-square","reception","phone","internet","connection","wifi","bluetooth","bars"],k:[27,19],o:2},chocolate_bar:{a:"Chocolate Bar",b:"1F36B",j:["food","snack","dessert","sweet"],k:[7,10],o:2},manual_wheelchair:{a:"Manual Wheelchair",b:"1F9BD",k:[44,5],o:12},snail:{a:"Snail",b:"1F40C",j:["slow","animal","shell"],k:[11,40],o:2},motorized_wheelchair:{a:"Motorized Wheelchair",b:"1F9BC",k:[44,4],o:12},"flag-gi":{a:"Gibraltar Flag",b:"1F1EC-1F1EE",k:[2,4],o:2},hankey:{a:"Pile of Poo",b:"1F4A9",k:[25,51],n:["poop","shit"],o:2},vibration_mode:{a:"Vibration Mode",b:"1F4F3",j:["orange-square","phone"],k:[27,16],o:2},deaf_woman:{a:"Deaf Woman",b:"1F9CF-200D-2640-FE0F",c:"1F9CF-200D-2640",k:[44,55],o:12},butterfly:{a:"Butterfly",b:"1F98B",j:["animal","insect","nature","caterpillar"],k:[42,29],o:4},video_camera:{a:"Video Camera",b:"1F4F9",j:["film","record"],k:[27,22],o:2},candy:{a:"Candy",b:"1F36C",j:["snack","dessert","sweet","lolly"],k:[7,11],o:2},auto_rickshaw:{a:"Auto Rickshaw",b:"1F6FA",k:[37,2],o:12},mobile_phone_off:{a:"Mobile Phone off",b:"1F4F4",j:["mute","orange-square","silence","quiet"],k:[27,17],o:2},clown_face:{a:"Clown Face",b:"1F921",j:["face"],k:[38,18],o:4},lollipop:{a:"Lollipop",b:"1F36D",j:["food","snack","candy","sweet"],k:[7,12],o:2},"flag-gl":{a:"Greenland Flag",b:"1F1EC-1F1F1",k:[2,5],o:2},vhs:{a:"Videocassette",b:"1F4FC",j:["record","video","oldschool","90s","80s"],k:[27,25],o:2},bug:{a:"Bug",b:"1F41B",j:["animal","insect","nature","worm"],k:[11,56],o:2},bike:{a:"Bicycle",b:"1F6B2",j:["sports","bicycle","exercise","hipster"],k:[35,9],o:2},"man-bowing":{obsoletes:"1F647",a:"Man Bowing",b:"1F647-200D-2642-FE0F",c:"1F647-200D-2642",k:[32,32],o:4},female_sign:{a:"Female Sign",b:"2640-FE0F",c:"2640",k:[53,18],o:4},japanese_ogre:{a:"Japanese Ogre",b:"1F479",j:["monster","red","mask","halloween","scary","creepy","devil","demon","japanese","ogre"],k:[23,34],o:2},custard:{a:"Custard",b:"1F36E",j:["dessert","food"],k:[7,13],o:2},ant:{a:"Ant",b:"1F41C",j:["animal","insect","nature","bug"],k:[12,0],o:2},mag:{a:"Left-Pointing Magnifying Glass",b:"1F50D",j:["search","zoom","find","detective"],k:[27,41],o:2},"flag-gm":{a:"Gambia Flag",b:"1F1EC-1F1F2",k:[2,6],o:2},honey_pot:{a:"Honey Pot",b:"1F36F",j:["bees","sweet","kitchen"],k:[7,14],o:2},"woman-bowing":{a:"Woman Bowing",b:"1F647-200D-2640-FE0F",c:"1F647-200D-2640",k:[32,26],o:4},male_sign:{a:"Male Sign",b:"2642-FE0F",c:"2642",k:[53,19],o:4},mag_right:{a:"Right-Pointing Magnifying Glass",b:"1F50E",j:["search","zoom","find","detective"],k:[27,42],o:2},japanese_goblin:{a:"Japanese Goblin",b:"1F47A",j:["red","evil","mask","monster","scary","creepy","japanese","goblin"],k:[23,35],o:2},scooter:{a:"Scooter",b:"1F6F4",k:[36,53],o:4},bee:{a:"Honeybee",b:"1F41D",k:[12,1],n:["honeybee"],o:2},"flag-gn":{a:"Guinea Flag",b:"1F1EC-1F1F3",k:[2,7],o:2},candle:{a:"Candle",b:"1F56F-FE0F",c:"1F56F",j:["fire","wax"],k:[29,6],o:2},skateboard:{a:"Skateboard",b:"1F6F9",k:[37,1],o:11},medical_symbol:{a:"Medical Symbol",b:"2695-FE0F",c:"2695",k:[53,44],n:["staff_of_aesculapius"],o:4},ghost:{a:"Ghost",b:"1F47B",j:["halloween","spooky","scary"],k:[23,36],o:2},beetle:{a:"Lady Beetle",b:"1F41E",j:["animal","insect","nature","ladybug"],k:[12,2],o:2},"flag-gp":{a:"Guadeloupe Flag",b:"1F1EC-1F1F5",k:[2,8],o:2},baby_bottle:{a:"Baby Bottle",b:"1F37C",j:["food","container","milk"],k:[7,27],o:2},infinity:{a:"Infinity",b:"267E-FE0F",c:"267E",k:[53,39],o:11},glass_of_milk:{a:"Glass of Milk",b:"1F95B",k:[41,42],o:4},"man-facepalming":{a:"Man Facepalming",b:"1F926-200D-2642-FE0F",c:"1F926-200D-2642",k:[38,29],o:4},cricket:{a:"Cricket",b:"1F997",j:["sports"],k:[42,41],o:5},busstop:{a:"Bus Stop",b:"1F68F",j:["transportation","wait"],k:[34,14],o:2},"flag-gq":{a:"Equatorial Guinea Flag",b:"1F1EC-1F1F6",k:[2,9],o:2},alien:{a:"Extraterrestrial Alien",b:"1F47D",j:["UFO","paul","weird","outer_space"],k:[23,43],o:2},bulb:{a:"Electric Light Bulb",b:"1F4A1",j:["light","electricity","idea"],k:[25,43],o:2},"woman-facepalming":{a:"Woman Facepalming",b:"1F926-200D-2640-FE0F",c:"1F926-200D-2640",k:[38,23],o:4},spider:{a:"Spider",b:"1F577-FE0F",c:"1F577",j:["animal","arachnid"],k:[29,34],o:2},space_invader:{a:"Alien Monster",b:"1F47E",j:["game","arcade","play"],k:[23,44],o:2},motorway:{a:"Motorway",b:"1F6E3-FE0F",c:"1F6E3",j:["road","cupertino","interstate","highway"],k:[36,45],o:2},"flag-gr":{a:"Greece Flag",b:"1F1EC-1F1F7",k:[2,10],o:2},recycle:{a:"Black Universal Recycling Symbol",b:"267B-FE0F",c:"267B",j:["arrow","environment","garbage","trash"],k:[53,38],o:2},coffee:{a:"Hot Beverage",b:"2615",j:["beverage","caffeine","latte","espresso"],k:[53,0],o:2},flashlight:{a:"Electric Torch",b:"1F526",j:["dark","camping","sight","night"],k:[28,9],o:2},spider_web:{a:"Spider Web",b:"1F578-FE0F",c:"1F578",j:["animal","insect","arachnid","silk"],k:[29,35],o:2},izakaya_lantern:{a:"Izakaya Lantern",b:"1F3EE",j:["light","paper","halloween","spooky"],k:[11,8],n:["lantern"],o:2},"flag-gs":{a:"South Georgia & South Sandwich Islands Flag",b:"1F1EC-1F1F8",k:[2,11],o:2},fleur_de_lis:{a:"Fleur De Lis",b:"269C-FE0F",c:"269C",j:["decorative","scout"],k:[53,49],o:2},robot_face:{a:"Robot Face",b:"1F916",k:[37,29],o:2},railway_track:{a:"Railway Track",b:"1F6E4-FE0F",c:"1F6E4",j:["train","transportation"],k:[36,46],o:2},tea:{a:"Teacup Without Handle",b:"1F375",j:["drink","bowl","breakfast","green","british"],k:[7,20],o:2},"flag-gt":{a:"Guatemala Flag",b:"1F1EC-1F1F9",k:[2,12],o:2},oil_drum:{a:"Oil Drum",b:"1F6E2-FE0F",c:"1F6E2",j:["barrell"],k:[36,44],o:2},diya_lamp:{a:"Diya Lamp",b:"1FA94",k:[52,8],o:12},sake:{a:"Sake Bottle and Cup",b:"1F376",j:["wine","drink","drunk","beverage","japanese","alcohol","booze"],k:[7,21],o:2},trident:{a:"Trident Emblem",b:"1F531",j:["weapon","spear"],k:[28,20],o:2},"man-shrugging":{a:"Man Shrugging",b:"1F937-200D-2642-FE0F",c:"1F937-200D-2642",k:[39,41],o:4},smiley_cat:{a:"Smiling Cat Face with Open Mouth",b:"1F63A",j:["animal","cats","happy","smile"],k:[31,36],o:2},scorpion:{a:"Scorpion",b:"1F982",j:["animal","arachnid"],k:[42,20],o:2},"woman-shrugging":{a:"Woman Shrugging",b:"1F937-200D-2640-FE0F",c:"1F937-200D-2640",k:[39,35],o:4},notebook_with_decorative_cover:{a:"Notebook with Decorative Cover",b:"1F4D4",j:["classroom","notes","record","paper","study"],k:[26,42],o:2},fuelpump:{a:"Fuel Pump",b:"26FD",j:["gas station","petroleum"],k:[54,38],o:2},name_badge:{a:"Name Badge",b:"1F4DB",j:["fire","forbid"],k:[26,49],o:2},mosquito:{a:"Mosquito",b:"1F99F",k:[42,49],o:11},"flag-gu":{a:"Guam Flag",b:"1F1EC-1F1FA",k:[2,13],o:2},smile_cat:{a:"Grinning Cat Face with Smiling Eyes",b:"1F638",j:["animal","cats","smile"],k:[31,34],o:2},champagne:{a:"Bottle with Popping Cork",b:"1F37E",j:["drink","wine","bottle","celebration"],k:[7,29],o:2},joy_cat:{a:"Cat Face with Tears of Joy",b:"1F639",j:["animal","cats","haha","happy","tears"],k:[31,35],o:2},closed_book:{a:"Closed Book",b:"1F4D5",j:["read","library","knowledge","textbook","learn"],k:[26,43],o:2},rotating_light:{a:"Police Cars Revolving Light",b:"1F6A8",j:["police","ambulance","911","emergency","alert","error","pinged","law","legal"],k:[34,56],o:2},microbe:{a:"Microbe",b:"1F9A0",k:[42,50],o:11},"flag-gw":{a:"Guinea-Bissau Flag",b:"1F1EC-1F1FC",k:[2,14],o:2},wine_glass:{a:"Wine Glass",b:"1F377",j:["drink","beverage","drunk","alcohol","booze"],k:[7,22],o:2},beginner:{a:"Japanese Symbol for Beginner",b:"1F530",j:["badge","shield"],k:[28,19],o:2},bouquet:{a:"Bouquet",b:"1F490",j:["flowers","nature","spring"],k:[25,26],o:2},heart_eyes_cat:{a:"Smiling Cat Face with Heart-Shaped Eyes",b:"1F63B",j:["animal","love","like","affection","cats","valentines","heart"],k:[31,37],o:2},"male-doctor":{a:"Male Doctor",b:"1F468-200D-2695-FE0F",c:"1F468-200D-2695",k:[17,2],o:4},book:{a:"Open Book",b:"1F4D6",k:[26,44],n:["open_book"],o:2},traffic_light:{a:"Horizontal Traffic Light",b:"1F6A5",j:["transportation","signal"],k:[34,53],o:2},cocktail:{a:"Cocktail Glass",b:"1F378",j:["drink","drunk","alcohol","beverage","booze","mojito"],k:[7,23],o:2},o:{a:"Heavy Large Circle",b:"2B55",j:["circle","round"],k:[55,43],o:2},"flag-gy":{a:"Guyana Flag",b:"1F1EC-1F1FE",k:[2,15],o:2},"female-doctor":{a:"Female Doctor",b:"1F469-200D-2695-FE0F",c:"1F469-200D-2695",k:[19,44],o:4},smirk_cat:{a:"Cat Face with Wry Smile",b:"1F63C",j:["animal","cats","smirk"],k:[31,38],o:2},green_book:{a:"Green Book",b:"1F4D7",j:["read","library","knowledge","study"],k:[26,45],o:2},cherry_blossom:{a:"Cherry Blossom",b:"1F338",j:["nature","plant","spring","flower"],k:[6,16],o:2},"flag-hk":{a:"Hong Kong Sar China Flag",b:"1F1ED-1F1F0",k:[2,16],o:2},vertical_traffic_light:{a:"Vertical Traffic Light",b:"1F6A6",j:["transportation","driving"],k:[34,54],o:2},white_check_mark:{a:"White Heavy Check Mark",b:"2705",j:["green-square","ok","agree","vote","election","answer","tick"],k:[54,40],o:2},tropical_drink:{a:"Tropical Drink",b:"1F379",j:["beverage","cocktail","summer","beach","alcohol","booze","mojito"],k:[7,24],o:2},kissing_cat:{a:"Kissing Cat Face with Closed Eyes",b:"1F63D",j:["animal","cats","kiss"],k:[31,39],o:2},"flag-hm":{a:"Heard & Mcdonald Islands Flag",b:"1F1ED-1F1F2",k:[2,17],o:2},octagonal_sign:{a:"Octagonal Sign",b:"1F6D1",k:[36,39],o:4},white_flower:{a:"White Flower",b:"1F4AE",j:["japanese","spring"],k:[26,4],o:2},ballot_box_with_check:{a:"Ballot Box with Check",b:"2611-FE0F",c:"2611",j:["ok","agree","confirm","black-square","vote","election","yes","tick"],k:[52,55],o:2},blue_book:{a:"Blue Book",b:"1F4D8",j:["read","library","knowledge","learn","study"],k:[26,46],o:2},beer:{a:"Beer Mug",b:"1F37A",j:["relax","beverage","drink","drunk","party","pub","summer","alcohol","booze"],k:[7,25],o:2},construction:{a:"Construction Sign",b:"1F6A7",j:["wip","progress","caution","warning"],k:[34,55],o:2},rosette:{a:"Rosette",b:"1F3F5-FE0F",c:"1F3F5",j:["flower","decoration","military"],k:[11,18],o:2},heavy_check_mark:{a:"Heavy Check Mark",b:"2714-FE0F",c:"2714",j:["ok","nike","answer","yes","tick"],k:[55,12],o:2},scream_cat:{a:"Weary Cat Face",b:"1F640",j:["animal","cats","munch","scared","scream"],k:[31,42],o:2},orange_book:{a:"Orange Book",b:"1F4D9",j:["read","library","knowledge","textbook","study"],k:[26,47],o:2},beers:{a:"Clinking Beer Mugs",b:"1F37B",j:["relax","beverage","drink","drunk","party","pub","summer","alcohol","booze"],k:[7,26],o:2},"male-student":{a:"Male Student",b:"1F468-200D-1F393",k:[14,50],o:4},"flag-hn":{a:"Honduras Flag",b:"1F1ED-1F1F3",k:[2,18],o:2},crying_cat_face:{a:"Crying Cat Face",b:"1F63F",j:["animal","tears","weep","sad","cats","upset","cry"],k:[31,41],o:2},anchor:{a:"Anchor",b:"2693",j:["ship","ferry","sea","boat"],k:[53,42],o:2},"flag-hr":{a:"Croatia Flag",b:"1F1ED-1F1F7",k:[2,19],o:2},heavy_multiplication_x:{a:"Heavy Multiplication X",b:"2716-FE0F",c:"2716",j:["math","calculation"],k:[55,13],o:2},"female-student":{a:"Female Student",b:"1F469-200D-1F393",k:[17,40],o:4},rose:{a:"Rose",b:"1F339",j:["flowers","valentines","love","spring"],k:[6,17],o:2},books:{a:"Books",b:"1F4DA",j:["literature","library","study"],k:[26,48],o:2},clinking_glasses:{a:"Clinking Glasses",b:"1F942",j:["beverage","drink","party","alcohol","celebrate","cheers"],k:[41,18],o:4},x:{a:"Cross Mark",b:"274C",j:["no","delete","remove","cancel"],k:[55,21],o:2},pouting_cat:{a:"Pouting Cat Face",b:"1F63E",j:["animal","cats"],k:[31,40],o:2},wilted_flower:{a:"Wilted Flower",b:"1F940",j:["plant","nature","flower"],k:[41,16],o:4},boat:{a:"Sailboat",b:"26F5",k:[54,16],n:["sailboat"],o:2},"flag-ht":{a:"Haiti Flag",b:"1F1ED-1F1F9",k:[2,20],o:2},tumbler_glass:{a:"Tumbler Glass",b:"1F943",j:["drink","beverage","drunk","alcohol","liquor","booze","bourbon","scotch","whisky","glass","shot"],k:[41,19],o:4},notebook:{a:"Notebook",b:"1F4D3",j:["stationery","record","notes","paper","study"],k:[26,41],o:2},"male-teacher":{a:"Male Teacher",b:"1F468-200D-1F3EB",k:[15,11],o:4},ledger:{a:"Ledger",b:"1F4D2",j:["notes","paper"],k:[26,40],o:2},"flag-hu":{a:"Hungary Flag",b:"1F1ED-1F1FA",k:[2,21],o:2},cup_with_straw:{a:"Cup with Straw",b:"1F964",k:[41,51],o:5},hibiscus:{a:"Hibiscus",b:"1F33A",j:["plant","vegetable","flowers","beach"],k:[6,18],o:2},see_no_evil:{a:"See-No-Evil Monkey",b:"1F648",j:["monkey","animal","nature","haha"],k:[32,44],o:2},canoe:{a:"Canoe",b:"1F6F6",j:["boat","paddle","water","ship"],k:[36,55],o:4},negative_squared_cross_mark:{a:"Negative Squared Cross Mark",b:"274E",j:["x","green-square","no","deny"],k:[55,22],o:2},"flag-ic":{a:"Canary Islands Flag",b:"1F1EE-1F1E8",k:[2,22],o:2},beverage_box:{a:"Beverage Box",b:"1F9C3",k:[44,11],o:12},speedboat:{a:"Speedboat",b:"1F6A4",j:["ship","transportation","vehicle","summer"],k:[34,52],o:2},heavy_plus_sign:{a:"Heavy Plus Sign",b:"2795",j:["math","calculation","addition","more","increase"],k:[55,29],o:2},sunflower:{a:"Sunflower",b:"1F33B",j:["nature","plant","fall"],k:[6,19],o:2},page_with_curl:{a:"Page with Curl",b:"1F4C3",j:["documents","office","paper"],k:[26,25],o:2},"female-teacher":{a:"Female Teacher",b:"1F469-200D-1F3EB",k:[18,1],o:4},hear_no_evil:{a:"Hear-No-Evil Monkey",b:"1F649",j:["animal","monkey","nature"],k:[32,45],o:2},mate_drink:{a:"Mate Drink",b:"1F9C9",k:[44,17],o:12},passenger_ship:{a:"Passenger Ship",b:"1F6F3-FE0F",c:"1F6F3",j:["yacht","cruise","ferry"],k:[36,52],o:2},scroll:{a:"Scroll",b:"1F4DC",j:["documents","ancient","history","paper"],k:[26,50],o:2},blossom:{a:"Blossom",b:"1F33C",j:["nature","flowers","yellow"],k:[6,20],o:2},"flag-id":{a:"Indonesia Flag",b:"1F1EE-1F1E9",k:[2,23],o:2},speak_no_evil:{a:"Speak-No-Evil Monkey",b:"1F64A",j:["monkey","animal","nature","omg"],k:[32,46],o:2},heavy_minus_sign:{a:"Heavy Minus Sign",b:"2796",j:["math","calculation","subtract","less"],k:[55,30],o:2},"flag-ie":{a:"Ireland Flag",b:"1F1EE-1F1EA",k:[2,24],o:2},ice_cube:{a:"Ice Cube",b:"1F9CA",k:[44,18],o:12},page_facing_up:{a:"Page Facing Up",b:"1F4C4",j:["documents","office","paper","information"],k:[26,26],o:2},"male-judge":{a:"Male Judge",b:"1F468-200D-2696-FE0F",c:"1F468-200D-2696",k:[17,8],o:4},tulip:{a:"Tulip",b:"1F337",j:["flowers","plant","nature","summer","spring"],k:[6,15],o:2},ferry:{a:"Ferry",b:"26F4-FE0F",c:"26F4",j:["boat","ship","yacht"],k:[54,15],o:2},kiss:{a:"Kiss Mark",b:"1F48B",j:["face","lips","love","like","affection","valentines"],k:[25,21],o:2},heavy_division_sign:{a:"Heavy Division Sign",b:"2797",j:["divide","math","calculation"],k:[55,31],o:2},newspaper:{a:"Newspaper",b:"1F4F0",j:["press","headline"],k:[27,13],o:2},"female-judge":{a:"Female Judge",b:"1F469-200D-2696-FE0F",c:"1F469-200D-2696",k:[19,50],o:4},seedling:{a:"Seedling",b:"1F331",j:["plant","nature","grass","lawn","spring"],k:[6,9],o:2},love_letter:{a:"Love Letter",b:"1F48C",j:["email","like","affection","envelope","valentines"],k:[25,22],o:2},chopsticks:{a:"Chopsticks",b:"1F962",k:[41,49],o:5},motor_boat:{a:"Motor Boat",b:"1F6E5-FE0F",c:"1F6E5",j:["ship"],k:[36,47],o:2},"flag-il":{a:"Israel Flag",b:"1F1EE-1F1F1",k:[2,25],o:2},curly_loop:{a:"Curly Loop",b:"27B0",j:["scribble","draw","shape","squiggle"],k:[55,33],o:2},"flag-im":{a:"Isle of Man Flag",b:"1F1EE-1F1F2",k:[2,26],o:2},evergreen_tree:{a:"Evergreen Tree",b:"1F332",j:["plant","nature"],k:[6,10],o:2},cupid:{a:"Heart with Arrow",b:"1F498",j:["love","like","heart","affection","valentines"],k:[25,34],o:2},loop:{a:"Double Curly Loop",b:"27BF",j:["tape","cassette"],k:[55,34],o:2},ship:{a:"Ship",b:"1F6A2",j:["transportation","titanic","deploy"],k:[34,33],o:2},rolled_up_newspaper:{a:"Rolled Up Newspaper",b:"1F5DE-FE0F",c:"1F5DE",k:[30,23],o:2},knife_fork_plate:{a:"Knife Fork Plate",b:"1F37D-FE0F",c:"1F37D",k:[7,28],o:2},fork_and_knife:{a:"Fork and Knife",b:"1F374",j:["cutlery","kitchen"],k:[7,19],o:2},"male-farmer":{a:"Male Farmer",b:"1F468-200D-1F33E",k:[14,38],o:4},bookmark_tabs:{a:"Bookmark Tabs",b:"1F4D1",j:["favorite","save","order","tidy"],k:[26,39],o:2},part_alternation_mark:{a:"Part Alternation Mark",b:"303D-FE0F",c:"303D",j:["graph","presentation","stats","business","economics","bad"],k:[55,45],o:2},"flag-in":{a:"India Flag",b:"1F1EE-1F1F3",k:[2,27],o:2},gift_heart:{a:"Heart with Ribbon",b:"1F49D",j:["love","valentines"],k:[25,39],o:2},airplane:{a:"Airplane",b:"2708-FE0F",c:"2708",j:["vehicle","transportation","flight","fly"],k:[54,41],o:2},deciduous_tree:{a:"Deciduous Tree",b:"1F333",j:["plant","nature"],k:[6,11],o:2},spoon:{a:"Spoon",b:"1F944",j:["cutlery","kitchen","tableware"],k:[41,20],o:4},"flag-io":{a:"British Indian Ocean Territory Flag",b:"1F1EE-1F1F4",k:[2,28],o:2},palm_tree:{a:"Palm Tree",b:"1F334",j:["plant","vegetable","nature","summer","beach","mojito","tropical"],k:[6,12],o:2},sparkling_heart:{a:"Sparkling Heart",b:"1F496",j:["love","like","affection","valentines"],k:[25,32],o:2},"female-farmer":{a:"Female Farmer",b:"1F469-200D-1F33E",k:[17,28],o:4},eight_spoked_asterisk:{a:"Eight Spoked Asterisk",b:"2733-FE0F",c:"2733",j:["star","sparkle","green-square"],k:[55,17],o:2},small_airplane:{a:"Small Airplane",b:"1F6E9-FE0F",c:"1F6E9",j:["flight","transportation","fly","vehicle"],k:[36,48],o:2},bookmark:{a:"Bookmark",b:"1F516",j:["favorite","label","save"],k:[27,50],o:2},eight_pointed_black_star:{a:"Eight Pointed Black Star",b:"2734-FE0F",c:"2734",j:["orange-square","shape","polygon"],k:[55,18],o:2},heartpulse:{a:"Growing Heart",b:"1F497",j:["like","love","affection","valentines","pink"],k:[25,33],o:2},label:{a:"Label",b:"1F3F7-FE0F",c:"1F3F7",j:["sale","tag"],k:[11,19],o:2},"flag-iq":{a:"Iraq Flag",b:"1F1EE-1F1F6",k:[2,29],o:2},hocho:{a:"Hocho",b:"1F52A",j:["knife","blade","cutlery","kitchen","weapon"],k:[28,13],n:["knife"],o:2},cactus:{a:"Cactus",b:"1F335",j:["vegetable","plant","nature"],k:[6,13],o:2},airplane_departure:{a:"Airplane Departure",b:"1F6EB",k:[36,49],o:2},airplane_arriving:{a:"Airplane Arriving",b:"1F6EC",k:[36,50],o:2},ear_of_rice:{a:"Ear of Rice",b:"1F33E",j:["nature","plant"],k:[6,22],o:2},"flag-ir":{a:"Iran Flag",b:"1F1EE-1F1F7",k:[2,30],o:2},moneybag:{a:"Money Bag",b:"1F4B0",j:["dollar","payment","coins","sale"],k:[26,6],o:2},"male-cook":{a:"Male Cook",b:"1F468-200D-1F373",k:[14,44],o:4},heartbeat:{a:"Beating Heart",b:"1F493",j:["love","like","affection","valentines","pink","heart"],k:[25,29],o:2},sparkle:{a:"Sparkle",b:"2747-FE0F",c:"2747",j:["stars","green-square","awesome","good","fireworks"],k:[55,20],o:2},amphora:{a:"Amphora",b:"1F3FA",j:["vase","jar"],k:[11,22],o:2},yen:{a:"Banknote with Yen Sign",b:"1F4B4",j:["money","sales","japanese","dollar","currency"],k:[26,10],o:2},revolving_hearts:{a:"Revolving Hearts",b:"1F49E",j:["love","like","affection","valentines"],k:[25,40],o:2},bangbang:{a:"Double Exclamation Mark",b:"203C-FE0F",c:"203C",j:["exclamation","surprise"],k:[52,10],o:2},parachute:{a:"Parachute",b:"1FA82",k:[52,3],o:12},herb:{a:"Herb",b:"1F33F",j:["vegetable","plant","medicine","weed","grass","lawn"],k:[6,23],o:2},"flag-is":{a:"Iceland Flag",b:"1F1EE-1F1F8",k:[2,31],o:2},"female-cook":{a:"Female Cook",b:"1F469-200D-1F373",k:[17,34],o:4},interrobang:{a:"Exclamation Question Mark",b:"2049-FE0F",c:"2049",j:["wat","punctuation","surprise"],k:[52,11],o:2},seat:{a:"Seat",b:"1F4BA",j:["sit","airplane","transport","bus","flight","fly"],k:[26,16],o:2},dollar:{a:"Banknote with Dollar Sign",b:"1F4B5",j:["money","sales","bill","currency"],k:[26,11],o:2},two_hearts:{a:"Two Hearts",b:"1F495",j:["love","like","affection","valentines","heart"],k:[25,31],o:2},it:{a:"Italy Flag",b:"1F1EE-1F1F9",j:["italy","flag","nation","country","banner"],k:[2,32],n:["flag-it"],o:2},shamrock:{a:"Shamrock",b:"2618-FE0F",c:"2618",j:["vegetable","plant","nature","irish","clover"],k:[53,1],o:2},four_leaf_clover:{a:"Four Leaf Clover",b:"1F340",j:["vegetable","plant","nature","lucky","irish"],k:[6,24],o:2},euro:{a:"Banknote with Euro Sign",b:"1F4B6",j:["money","sales","dollar","currency"],k:[26,12],o:2},question:{a:"Black Question Mark Ornament",b:"2753",j:["doubt","confused"],k:[55,23],o:2},helicopter:{a:"Helicopter",b:"1F681",j:["transportation","vehicle","fly"],k:[34,0],o:2},heart_decoration:{a:"Heart Decoration",b:"1F49F",j:["purple-square","love","like"],k:[25,41],o:2},"flag-je":{a:"Jersey Flag",b:"1F1EF-1F1EA",k:[2,33],o:2},"male-mechanic":{a:"Male Mechanic",b:"1F468-200D-1F527",k:[15,50],o:4},suspension_railway:{a:"Suspension Railway",b:"1F69F",j:["vehicle","transportation"],k:[34,30],o:2},heavy_heart_exclamation_mark_ornament:{a:"Heavy Heart Exclamation Mark Ornament",b:"2763-FE0F",c:"2763",k:[55,27],o:2},"female-mechanic":{a:"Female Mechanic",b:"1F469-200D-1F527",k:[18,35],o:4},"flag-jm":{a:"Jamaica Flag",b:"1F1EF-1F1F2",k:[2,34],o:2},grey_question:{a:"White Question Mark Ornament",b:"2754",j:["doubts","gray","huh","confused"],k:[55,24],o:2},maple_leaf:{a:"Maple Leaf",b:"1F341",j:["nature","plant","vegetable","ca","fall"],k:[6,25],o:2},pound:{a:"Banknote with Pound Sign",b:"1F4B7",j:["british","sterling","money","sales","bills","uk","england","currency"],k:[26,13],o:2},money_with_wings:{a:"Money with Wings",b:"1F4B8",j:["dollar","bills","payment","sale"],k:[26,14],o:2},"flag-jo":{a:"Jordan Flag",b:"1F1EF-1F1F4",k:[2,35],o:2},fallen_leaf:{a:"Fallen Leaf",b:"1F342",j:["nature","plant","vegetable","leaves"],k:[6,26],o:2},broken_heart:{a:"Broken Heart",b:"1F494",j:["sad","sorry","break","heart","heartbreak"],k:[25,30],l:["</3"],m:"</3",o:2},grey_exclamation:{a:"White Exclamation Mark Ornament",b:"2755",j:["surprise","punctuation","gray","wow","warning"],k:[55,25],o:2},mountain_cableway:{a:"Mountain Cableway",b:"1F6A0",j:["transportation","vehicle","ski"],k:[34,31],o:2},exclamation:{a:"Heavy Exclamation Mark Symbol",b:"2757",j:["heavy_exclamation_mark","danger","surprise","punctuation","wow","warning"],k:[55,26],n:["heavy_exclamation_mark"],o:2},leaves:{a:"Leaf Fluttering in Wind",b:"1F343",j:["nature","plant","tree","vegetable","grass","lawn","spring"],k:[6,27],o:2},heart:{a:"Heavy Black Heart",b:"2764-FE0F",c:"2764",j:["love","like","valentines"],k:[55,28],l:["<3"],m:"<3",o:2},jp:{a:"Japan Flag",b:"1F1EF-1F1F5",j:["japanese","nation","flag","country","banner"],k:[2,36],n:["flag-jp"],o:2},"male-factory-worker":{a:"Male Factory Worker",b:"1F468-200D-1F3ED",k:[15,17],o:4},credit_card:{a:"Credit Card",b:"1F4B3",j:["money","sales","dollar","bill","payment","shopping"],k:[26,9],o:2},aerial_tramway:{a:"Aerial Tramway",b:"1F6A1",j:["transportation","vehicle","ski"],k:[34,32],o:2},"female-factory-worker":{a:"Female Factory Worker",b:"1F469-200D-1F3ED",k:[18,7],o:4},receipt:{a:"Receipt",b:"1F9FE",k:[51,49],o:11},wavy_dash:{a:"Wavy Dash",b:"3030-FE0F",c:"3030",j:["draw","line","moustache","mustache","squiggle","scribble"],k:[55,44],o:2},"flag-ke":{a:"Kenya Flag",b:"1F1F0-1F1EA",k:[2,37],o:2},satellite:{a:"Satellite",b:"1F6F0-FE0F",c:"1F6F0",j:["communication","future","radio","space"],k:[36,51],o:2},orange_heart:{a:"Orange Heart",b:"1F9E1",k:[51,20],o:5},yellow_heart:{a:"Yellow Heart",b:"1F49B",j:["love","like","affection","valentines"],k:[25,37],m:"<3",o:2},rocket:{a:"Rocket",b:"1F680",j:["launch","ship","staffmode","NASA","outer space","outer_space","fly"],k:[33,56],o:2},chart:{a:"Chart with Upwards Trend and Yen Sign",b:"1F4B9",j:["green-square","graph","presentation","stats"],k:[26,15],o:2},"flag-kg":{a:"Kyrgyzstan Flag",b:"1F1F0-1F1EC",k:[2,38],o:2},currency_exchange:{a:"Currency Exchange",b:"1F4B1",j:["money","sales","dollar","travel"],k:[26,7],o:2},green_heart:{a:"Green Heart",b:"1F49A",j:["love","like","affection","valentines"],k:[25,36],m:"<3",o:2},flying_saucer:{a:"Flying Saucer",b:"1F6F8",k:[37,0],o:5},"flag-kh":{a:"Cambodia Flag",b:"1F1F0-1F1ED",k:[2,39],o:2},"male-office-worker":{a:"Male Office Worker",b:"1F468-200D-1F4BC",k:[15,44],o:4},tm:{a:"Trade Mark Sign",b:"2122-FE0F",c:"2122",j:["trademark","brand","law","legal"],k:[52,12],o:2},bellhop_bell:{a:"Bellhop Bell",b:"1F6CE-FE0F",c:"1F6CE",j:["service"],k:[36,36],o:2},blue_heart:{a:"Blue Heart",b:"1F499",j:["love","like","affection","valentines"],k:[25,35],m:"<3",o:2},"flag-ki":{a:"Kiribati Flag",b:"1F1F0-1F1EE",k:[2,40],o:2},heavy_dollar_sign:{a:"Heavy Dollar Sign",b:"1F4B2",j:["money","sales","payment","currency","buck"],k:[26,8],o:2},"female-office-worker":{a:"Female Office Worker",b:"1F469-200D-1F4BC",k:[18,29],o:4},purple_heart:{a:"Purple Heart",b:"1F49C",j:["love","like","affection","valentines"],k:[25,38],m:"<3",o:2},luggage:{a:"Luggage",b:"1F9F3",k:[51,38],o:11},"flag-km":{a:"Comoros Flag",b:"1F1F0-1F1F2",k:[2,41],o:2},email:{a:"Envelope",b:"2709-FE0F",c:"2709",j:["letter","postal","inbox","communication"],k:[54,42],n:["envelope"],o:2},"e-mail":{a:"E-Mail Symbol",b:"1F4E7",j:["communication","inbox"],k:[27,4],o:2},"flag-kn":{a:"St. Kitts & Nevis Flag",b:"1F1F0-1F1F3",k:[2,42],o:2},hourglass:{a:"Hourglass",b:"231B",j:["time","clock","oldschool","limit","exam","quiz","test"],k:[52,23],o:2},brown_heart:{a:"Brown Heart",b:"1F90E",k:[37,16],o:12},"male-scientist":{a:"Male Scientist",b:"1F468-200D-1F52C",k:[15,56],o:4},hourglass_flowing_sand:{a:"Hourglass with Flowing Sand",b:"23F3",j:["oldschool","time","countdown"],k:[52,36],o:2},black_heart:{a:"Black Heart",b:"1F5A4",j:["evil"],k:[30,9],o:4},incoming_envelope:{a:"Incoming Envelope",b:"1F4E8",j:["email","inbox"],k:[27,5],o:2},"flag-kp":{a:"North Korea Flag",b:"1F1F0-1F1F5",k:[2,43],o:2},"female-scientist":{a:"Female Scientist",b:"1F469-200D-1F52C",k:[18,41],o:4},watch:{a:"Watch",b:"231A",j:["time","accessories"],k:[52,22],o:2},white_heart:{a:"White Heart",b:"1F90D",k:[37,15],o:12},kr:{a:"South Korea Flag",b:"1F1F0-1F1F7",j:["south","korea","nation","flag","country","banner"],k:[2,44],n:["flag-kr"],o:2},envelope_with_arrow:{a:"Envelope with Downwards Arrow Above",b:"1F4E9",j:["email","communication"],k:[27,6],o:2},outbox_tray:{a:"Outbox Tray",b:"1F4E4",j:["inbox","email"],k:[27,1],o:2},"male-technologist":{a:"Male Technologist",b:"1F468-200D-1F4BB",k:[15,38],o:4},alarm_clock:{a:"Alarm Clock",b:"23F0",j:["time","wake"],k:[52,33],o:2},"flag-kw":{a:"Kuwait Flag",b:"1F1F0-1F1FC",k:[2,45],o:2},anger:{a:"Anger Symbol",b:"1F4A2",j:["angry","mad"],k:[25,44],o:2},inbox_tray:{a:"Inbox Tray",b:"1F4E5",j:["email","documents"],k:[27,2],o:2},"flag-ky":{a:"Cayman Islands Flag",b:"1F1F0-1F1FE",k:[2,46],o:2},stopwatch:{a:"Stopwatch",b:"23F1-FE0F",c:"23F1",j:["time","deadline"],k:[52,34],o:2},"female-technologist":{a:"Female Technologist",b:"1F469-200D-1F4BB",k:[18,23],o:4},boom:{a:"Collision Symbol",b:"1F4A5",j:["bomb","explode","explosion","collision","blown"],k:[25,47],n:["collision"],o:2},"flag-kz":{a:"Kazakhstan Flag",b:"1F1F0-1F1FF",k:[2,47],o:2},timer_clock:{a:"Timer Clock",b:"23F2-FE0F",c:"23F2",j:["alarm"],k:[52,35],o:2},"package":{a:"Package",b:"1F4E6",j:["mail","gift","cardboard","box","moving"],k:[27,3],o:2},mailbox:{a:"Closed Mailbox with Raised Flag",b:"1F4EB",j:["email","inbox","communication"],k:[27,8],o:2},"flag-la":{a:"Laos Flag",b:"1F1F1-1F1E6",k:[2,48],o:2},dizzy:{a:"Dizzy Symbol",b:"1F4AB",j:["star","sparkle","shoot","magic"],k:[26,1],o:2},"male-singer":{a:"Male Singer",b:"1F468-200D-1F3A4",k:[14,56],o:4},mantelpiece_clock:{a:"Mantelpiece Clock",b:"1F570-FE0F",c:"1F570",j:["time"],k:[29,7],o:2},"female-singer":{a:"Female Singer",b:"1F469-200D-1F3A4",k:[17,46],o:4},"flag-lb":{a:"Lebanon Flag",b:"1F1F1-1F1E7",k:[2,49],o:2},mailbox_closed:{a:"Closed Mailbox with Lowered Flag",b:"1F4EA",j:["email","communication","inbox"],k:[27,7],o:2},sweat_drops:{a:"Splashing Sweat Symbol",b:"1F4A6",j:["water","drip","oops"],k:[25,48],o:2},clock12:{a:"Clock Face Twelve Oclock",b:"1F55B",j:["time","noon","midnight","midday","late","early","schedule"],k:[28,50],o:2},mailbox_with_mail:{a:"Open Mailbox with Raised Flag",b:"1F4EC",j:["email","inbox","communication"],k:[27,9],o:2},clock1230:{a:"Clock Face Twelve-Thirty",b:"1F567",j:["time","late","early","schedule"],k:[29,5],o:2},dash:{a:"Dash Symbol",b:"1F4A8",j:["wind","air","fast","shoo","fart","smoke","puff"],k:[25,50],o:2},"flag-lc":{a:"St. Lucia Flag",b:"1F1F1-1F1E8",k:[2,50],o:2},hole:{a:"Hole",b:"1F573-FE0F",c:"1F573",j:["embarrassing"],k:[29,8],o:2},"male-artist":{a:"Male Artist",b:"1F468-200D-1F3A8",k:[15,5],o:4},clock1:{a:"Clock Face One Oclock",b:"1F550",j:["time","late","early","schedule"],k:[28,39],o:2},mailbox_with_no_mail:{a:"Open Mailbox with Lowered Flag",b:"1F4ED",j:["email","inbox"],k:[27,10],o:2},"flag-li":{a:"Liechtenstein Flag",b:"1F1F1-1F1EE",k:[2,51],o:2},bomb:{a:"Bomb",b:"1F4A3",j:["boom","explode","explosion","terrorism"],k:[25,45],o:2},postbox:{a:"Postbox",b:"1F4EE",j:["email","letter","envelope"],k:[27,11],o:2},"female-artist":{a:"Female Artist",b:"1F469-200D-1F3A8",k:[17,52],o:4},clock130:{a:"Clock Face One-Thirty",b:"1F55C",j:["time","late","early","schedule"],k:[28,51],o:2},"flag-lk":{a:"Sri Lanka Flag",b:"1F1F1-1F1F0",k:[2,52],o:2},ballot_box_with_ballot:{a:"Ballot Box with Ballot",b:"1F5F3-FE0F",c:"1F5F3",k:[30,28],o:2},keycap_ten:{a:"Keycap Ten",b:"1F51F",j:["numbers","10","blue-square"],k:[28,2],o:2},clock2:{a:"Clock Face Two Oclock",b:"1F551",j:["time","late","early","schedule"],k:[28,40],o:2},"flag-lr":{a:"Liberia Flag",b:"1F1F1-1F1F7",k:[2,53],o:2},speech_balloon:{a:"Speech Balloon",b:"1F4AC",j:["bubble","words","message","talk","chatting"],k:[26,2],o:2},"flag-ls":{a:"Lesotho Flag",b:"1F1F1-1F1F8",k:[2,54],o:2},clock230:{a:"Clock Face Two-Thirty",b:"1F55D",j:["time","late","early","schedule"],k:[28,52],o:2},"male-pilot":{a:"Male Pilot",b:"1F468-200D-2708-FE0F",c:"1F468-200D-2708",k:[17,14],o:4},capital_abcd:{a:"Input Symbol for Latin Capital Letters",b:"1F520",j:["alphabet","words","blue-square"],k:[28,3],o:2},pencil2:{a:"Pencil",b:"270F-FE0F",c:"270F",j:["stationery","write","paper","writing","school","study"],k:[55,10],o:2},"female-pilot":{a:"Female Pilot",b:"1F469-200D-2708-FE0F",c:"1F469-200D-2708",k:[19,56],o:4},black_nib:{a:"Black Nib",b:"2712-FE0F",c:"2712",j:["pen","stationery","writing","write"],k:[55,11],o:2},left_speech_bubble:{a:"Left Speech Bubble",b:"1F5E8-FE0F",c:"1F5E8",j:["words","message","talk","chatting"],k:[30,26],o:2},clock3:{a:"Clock Face Three Oclock",b:"1F552",j:["time","late","early","schedule"],k:[28,41],o:2},abcd:{a:"Input Symbol for Latin Small Letters",b:"1F521",j:["blue-square","alphabet"],k:[28,4],o:2},"flag-lt":{a:"Lithuania Flag",b:"1F1F1-1F1F9",k:[2,55],o:2},clock330:{a:"Clock Face Three-Thirty",b:"1F55E",j:["time","late","early","schedule"],k:[28,53],o:2},"flag-lu":{a:"Luxembourg Flag",b:"1F1F1-1F1FA",k:[2,56],o:2},right_anger_bubble:{a:"Right Anger Bubble",b:"1F5EF-FE0F",c:"1F5EF",j:["caption","speech","thinking","mad"],k:[30,27],o:2},lower_left_fountain_pen:{a:"Lower Left Fountain Pen",b:"1F58B-FE0F",c:"1F58B",k:[29,45],o:2},"male-astronaut":{a:"Male Astronaut",b:"1F468-200D-1F680",k:[16,5],o:4},thought_balloon:{a:"Thought Balloon",b:"1F4AD",j:["bubble","cloud","speech","thinking","dream"],k:[26,3],o:2},symbols:{a:"Input Symbol for Symbols",b:"1F523",j:["blue-square","music","note","ampersand","percent","glyphs","characters"],k:[28,6],o:2},clock4:{a:"Clock Face Four Oclock",b:"1F553",j:["time","late","early","schedule"],k:[28,42],o:2},"flag-lv":{a:"Latvia Flag",b:"1F1F1-1F1FB",k:[3,0],o:2},lower_left_ballpoint_pen:{a:"Lower Left Ballpoint Pen",b:"1F58A-FE0F",c:"1F58A",k:[29,44],o:2},abc:{a:"Input Symbol for Latin Letters",b:"1F524",j:["blue-square","alphabet"],k:[28,7],o:2},zzz:{a:"Sleeping Symbol",b:"1F4A4",j:["sleepy","tired","dream"],k:[25,46],o:2},lower_left_paintbrush:{a:"Lower Left Paintbrush",b:"1F58C-FE0F",c:"1F58C",k:[29,46],o:2},"female-astronaut":{a:"Female Astronaut",b:"1F469-200D-1F680",k:[18,47],o:4},"flag-ly":{a:"Libya Flag",b:"1F1F1-1F1FE",k:[3,1],o:2},clock430:{a:"Clock Face Four-Thirty",b:"1F55F",j:["time","late","early","schedule"],k:[28,54],o:2},"flag-ma":{a:"Morocco Flag",b:"1F1F2-1F1E6",k:[3,2],o:2},a:{a:"Negative Squared Latin Capital Letter a",b:"1F170-FE0F",c:"1F170",j:["red-square","alphabet","letter"],k:[0,16],o:2},clock5:{a:"Clock Face Five Oclock",b:"1F554",j:["time","late","early","schedule"],k:[28,43],o:2},lower_left_crayon:{a:"Lower Left Crayon",b:"1F58D-FE0F",c:"1F58D",k:[29,47],o:2},"male-firefighter":{a:"Male Firefighter",b:"1F468-200D-1F692",k:[16,11],o:4},memo:{a:"Memo",b:"1F4DD",j:["write","documents","stationery","pencil","paper","writing","legal","exam","quiz","test","study","compose"],k:[26,51],n:["pencil"],o:2},ab:{a:"Negative Squared Ab",b:"1F18E",j:["red-square","alphabet"],k:[0,20],o:2},"flag-mc":{a:"Monaco Flag",b:"1F1F2-1F1E8",k:[3,3],o:2},clock530:{a:"Clock Face Five-Thirty",b:"1F560",j:["time","late","early","schedule"],k:[28,55],o:2},briefcase:{a:"Briefcase",b:"1F4BC",j:["business","documents","work","law","legal","job","career"],k:[26,18],o:2},"female-firefighter":{a:"Female Firefighter",b:"1F469-200D-1F692",k:[18,53],o:4},clock6:{a:"Clock Face Six Oclock",b:"1F555",j:["time","late","early","schedule","dawn","dusk"],k:[28,44],o:2},b:{a:"Negative Squared Latin Capital Letter B",b:"1F171-FE0F",c:"1F171",j:["red-square","alphabet","letter"],k:[0,17],o:2},"flag-md":{a:"Moldova Flag",b:"1F1F2-1F1E9",k:[3,4],o:2},clock630:{a:"Clock Face Six-Thirty",b:"1F561",j:["time","late","early","schedule"],k:[28,56],o:2},cl:{a:"Squared Cl",b:"1F191",j:["alphabet","words","red-square"],k:[0,21],o:2},"flag-me":{a:"Montenegro Flag",b:"1F1F2-1F1EA",k:[3,5],o:2},file_folder:{a:"File Folder",b:"1F4C1",j:["documents","business","office"],k:[26,23],o:2},"male-police-officer":{obsoletes:"1F46E",a:"Male Police Officer",b:"1F46E-200D-2642-FE0F",c:"1F46E-200D-2642",k:[21,43],o:4},cool:{a:"Squared Cool",b:"1F192",j:["words","blue-square"],k:[0,22],o:2},clock7:{a:"Clock Face Seven Oclock",b:"1F556",j:["time","late","early","schedule"],k:[28,45],o:2},"flag-mf":{a:"St. Martin Flag",b:"1F1F2-1F1EB",k:[3,6],o:2},open_file_folder:{a:"Open File Folder",b:"1F4C2",j:["documents","load"],k:[26,24],o:2},card_index_dividers:{a:"Card Index Dividers",b:"1F5C2-FE0F",c:"1F5C2",j:["organizing","business","stationery"],k:[30,15],o:2},"flag-mg":{a:"Madagascar Flag",b:"1F1F2-1F1EC",k:[3,7],o:2},free:{a:"Squared Free",b:"1F193",j:["blue-square","words"],k:[0,23],o:2},"female-police-officer":{a:"Female Police Officer",b:"1F46E-200D-2640-FE0F",c:"1F46E-200D-2640",k:[21,37],o:4},clock730:{a:"Clock Face Seven-Thirty",b:"1F562",j:["time","late","early","schedule"],k:[29,0],o:2},date:{a:"Calendar",b:"1F4C5",j:["calendar","schedule"],k:[26,27],o:2},clock8:{a:"Clock Face Eight Oclock",b:"1F557",j:["time","late","early","schedule"],k:[28,46],o:2},information_source:{a:"Information Source",b:"2139-FE0F",c:"2139",j:["blue-square","alphabet","letter"],k:[52,13],o:2},"flag-mh":{a:"Marshall Islands Flag",b:"1F1F2-1F1ED",k:[3,8],o:2},clock830:{a:"Clock Face Eight-Thirty",b:"1F563",j:["time","late","early","schedule"],k:[29,1],o:2},calendar:{a:"Tear-off Calendar",b:"1F4C6",j:["schedule","date","planning"],k:[26,28],o:2},"flag-mk":{a:"North Macedonia Flag",b:"1F1F2-1F1F0",k:[3,9],o:2},id:{a:"Squared Id",b:"1F194",j:["purple-square","words"],k:[0,24],o:2},spiral_note_pad:{a:"Spiral Note Pad",b:"1F5D2-FE0F",c:"1F5D2",k:[30,19],o:2},clock9:{a:"Clock Face Nine Oclock",b:"1F558",j:["time","late","early","schedule"],k:[28,47],o:2},"flag-ml":{a:"Mali Flag",b:"1F1F2-1F1F1",k:[3,10],o:2},m:{a:"Circled Latin Capital Letter M",b:"24C2-FE0F",c:"24C2",j:["alphabet","blue-circle","letter"],k:[52,40],o:2},"flag-mm":{a:"Myanmar (burma) Flag",b:"1F1F2-1F1F2",k:[3,11],o:2},clock930:{a:"Clock Face Nine-Thirty",b:"1F564",j:["time","late","early","schedule"],k:[29,2],o:2},"new":{a:"Squared New",b:"1F195",j:["blue-square","words","start"],k:[0,25],o:2},spiral_calendar_pad:{a:"Spiral Calendar Pad",b:"1F5D3-FE0F",c:"1F5D3",k:[30,20],o:2},ng:{a:"Squared Ng",b:"1F196",j:["blue-square","words","shape","icon"],k:[0,26],o:2},card_index:{a:"Card Index",b:"1F4C7",j:["business","stationery"],k:[26,29],o:2},clock10:{a:"Clock Face Ten Oclock",b:"1F559",j:["time","late","early","schedule"],k:[28,48],o:2},"flag-mn":{a:"Mongolia Flag",b:"1F1F2-1F1F3",k:[3,12],o:2},"male-guard":{obsoletes:"1F482",a:"Male Guard",b:"1F482-200D-2642-FE0F",c:"1F482-200D-2642",k:[24,14],o:4},"flag-mo":{a:"Macao Sar China Flag",b:"1F1F2-1F1F4",k:[3,13],o:2},clock1030:{a:"Clock Face Ten-Thirty",b:"1F565",j:["time","late","early","schedule"],k:[29,3],o:2},chart_with_upwards_trend:{a:"Chart with Upwards Trend",b:"1F4C8",j:["graph","presentation","stats","recovery","business","economics","money","sales","good","success"],k:[26,30],o:2},o2:{a:"Negative Squared Latin Capital Letter O",b:"1F17E-FE0F",c:"1F17E",j:["alphabet","red-square","letter"],k:[0,18],o:2},"female-guard":{a:"Female Guard",b:"1F482-200D-2640-FE0F",c:"1F482-200D-2640",k:[24,8],o:4},chart_with_downwards_trend:{a:"Chart with Downwards Trend",b:"1F4C9",j:["graph","presentation","stats","recession","business","economics","money","sales","bad","failure"],k:[26,31],o:2},"flag-mp":{a:"Northern Mariana Islands Flag",b:"1F1F2-1F1F5",k:[3,14],o:2},ok:{a:"Squared Ok",b:"1F197",j:["good","agree","yes","blue-square"],k:[0,27],o:2},clock11:{a:"Clock Face Eleven Oclock",b:"1F55A",j:["time","late","early","schedule"],k:[28,49],o:2},"male-construction-worker":{obsoletes:"1F477",a:"Male Construction Worker",b:"1F477-200D-2642-FE0F",c:"1F477-200D-2642",k:[23,16],o:4},clock1130:{a:"Clock Face Eleven-Thirty",b:"1F566",j:["time","late","early","schedule"],k:[29,4],o:2},"flag-mq":{a:"Martinique Flag",b:"1F1F2-1F1F6",k:[3,15],o:2},bar_chart:{a:"Bar Chart",b:"1F4CA",j:["graph","presentation","stats"],k:[26,32],o:2},parking:{a:"Negative Squared Latin Capital Letter P",b:"1F17F-FE0F",c:"1F17F",j:["cars","blue-square","alphabet","letter"],k:[0,19],o:2},new_moon:{a:"New Moon Symbol",b:"1F311",j:["nature","twilight","planet","space","night","evening","sleep"],k:[5,36],o:2},"female-construction-worker":{a:"Female Construction Worker",b:"1F477-200D-2640-FE0F",c:"1F477-200D-2640",k:[23,10],o:4},sos:{a:"Squared Sos",b:"1F198",j:["help","red-square","words","emergency","911"],k:[0,28],o:2},clipboard:{a:"Clipboard",b:"1F4CB",j:["stationery","documents"],k:[26,33],o:2},"flag-mr":{a:"Mauritania Flag",b:"1F1F2-1F1F7",k:[3,16],o:2},prince:{a:"Prince",b:"1F934",j:["boy","man","male","crown","royal","king"],k:[39,17],o:4},waxing_crescent_moon:{a:"Waxing Crescent Moon Symbol",b:"1F312",j:["nature","twilight","planet","space","night","evening","sleep"],k:[5,37],o:2},"flag-ms":{a:"Montserrat Flag",b:"1F1F2-1F1F8",k:[3,17],o:2},pushpin:{a:"Pushpin",b:"1F4CC",j:["stationery","mark","here"],k:[26,34],o:2},up:{a:"Squared Up with Exclamation Mark",b:"1F199",j:["blue-square","above","high"],k:[0,29],o:2},"flag-mt":{a:"Malta Flag",b:"1F1F2-1F1F9",k:[3,18],o:2},princess:{a:"Princess",b:"1F478",j:["girl","woman","female","blond","crown","royal","queen"],k:[23,28],o:2},round_pushpin:{a:"Round Pushpin",b:"1F4CD",j:["stationery","location","map","here"],k:[26,35],o:2},first_quarter_moon:{a:"First Quarter Moon Symbol",b:"1F313",j:["nature","twilight","planet","space","night","evening","sleep"],k:[5,38],o:2},vs:{a:"Squared Vs",b:"1F19A",j:["words","orange-square"],k:[0,30],o:2},"flag-mu":{a:"Mauritius Flag",b:"1F1F2-1F1FA",k:[3,19],o:2},koko:{a:"Squared Katakana Koko",b:"1F201",j:["blue-square","here","katakana","japanese","destination"],k:[5,4],o:2},moon:{a:"Waxing Gibbous Moon Symbol",b:"1F314",k:[5,39],n:["waxing_gibbous_moon"],o:2},paperclip:{a:"Paperclip",b:"1F4CE",j:["documents","stationery"],k:[26,36],o:2},linked_paperclips:{a:"Linked Paperclips",b:"1F587-FE0F",c:"1F587",k:[29,43],o:2},"man-wearing-turban":{obsoletes:"1F473",a:"Man Wearing Turban",b:"1F473-200D-2642-FE0F",c:"1F473-200D-2642",k:[22,37],o:4},sa:{a:"Squared Katakana Sa",b:"1F202-FE0F",c:"1F202",j:["japanese","blue-square","katakana"],k:[5,5],o:2},full_moon:{a:"Full Moon Symbol",b:"1F315",j:["nature","yellow","twilight","planet","space","night","evening","sleep"],k:[5,40],o:2},"flag-mv":{a:"Maldives Flag",b:"1F1F2-1F1FB",k:[3,20],o:2},"flag-mw":{a:"Malawi Flag",b:"1F1F2-1F1FC",k:[3,21],o:2},waning_gibbous_moon:{a:"Waning Gibbous Moon Symbol",b:"1F316",j:["nature","twilight","planet","space","night","evening","sleep","waxing_gibbous_moon"],k:[5,41],o:2},"woman-wearing-turban":{a:"Woman Wearing Turban",b:"1F473-200D-2640-FE0F",c:"1F473-200D-2640",k:[22,31],o:4},u6708:{a:"Squared Cjk Unified Ideograph-6708",b:"1F237-FE0F",c:"1F237",j:["chinese","month","moon","japanese","orange-square","kanji"],k:[5,13],o:2},straight_ruler:{a:"Straight Ruler",b:"1F4CF",j:["stationery","calculate","length","math","school","drawing","architect","sketch"],k:[26,37],o:2},u6709:{a:"Squared Cjk Unified Ideograph-6709",b:"1F236",j:["orange-square","chinese","have","kanji"],k:[5,12],o:2},triangular_ruler:{a:"Triangular Ruler",b:"1F4D0",j:["stationery","math","architect","sketch"],k:[26,38],o:2},man_with_gua_pi_mao:{a:"Man with Gua Pi Mao",b:"1F472",j:["male","boy","chinese"],k:[22,25],o:2},"flag-mx":{a:"Mexico Flag",b:"1F1F2-1F1FD",k:[3,22],o:2},last_quarter_moon:{a:"Last Quarter Moon Symbol",b:"1F317",j:["nature","twilight","planet","space","night","evening","sleep"],k:[5,42],o:2},person_with_headscarf:{a:"Person with Headscarf",b:"1F9D5",k:[48,34],o:5},waning_crescent_moon:{a:"Waning Crescent Moon Symbol",b:"1F318",j:["nature","twilight","planet","space","night","evening","sleep"],k:[5,43],o:2},u6307:{a:"Squared Cjk Unified Ideograph-6307",b:"1F22F",j:["chinese","point","green-square","kanji"],k:[5,7],o:2},scissors:{a:"Black Scissors",b:"2702-FE0F",c:"2702",j:["stationery","cut"],k:[54,39],o:2},"flag-my":{a:"Malaysia Flag",b:"1F1F2-1F1FE",k:[3,23],o:2},ideograph_advantage:{a:"Circled Ideograph Advantage",b:"1F250",j:["chinese","kanji","obtain","get","circle"],k:[5,17],o:2},man_in_tuxedo:{a:"Man in Tuxedo",b:"1F935",j:["couple","marriage","wedding","groom"],k:[39,23],o:4},"flag-mz":{a:"Mozambique Flag",b:"1F1F2-1F1FF",k:[3,24],o:2},card_file_box:{a:"Card File Box",b:"1F5C3-FE0F",c:"1F5C3",j:["business","stationery"],k:[30,16],o:2},crescent_moon:{a:"Crescent Moon",b:"1F319",j:["night","sleep","sky","evening","magic"],k:[5,44],o:2},"flag-na":{a:"Namibia Flag",b:"1F1F3-1F1E6",k:[3,25],o:2},bride_with_veil:{a:"Bride with Veil",b:"1F470",j:["couple","marriage","wedding","woman","bride"],k:[22,1],o:2},new_moon_with_face:{a:"New Moon with Face",b:"1F31A",j:["nature","twilight","planet","space","night","evening","sleep"],k:[5,45],o:2},file_cabinet:{a:"File Cabinet",b:"1F5C4-FE0F",c:"1F5C4",j:["filing","organizing"],k:[30,17],o:2},u5272:{a:"Squared Cjk Unified Ideograph-5272",b:"1F239",j:["cut","divide","chinese","kanji","pink-square"],k:[5,15],o:2},wastebasket:{a:"Wastebasket",b:"1F5D1-FE0F",c:"1F5D1",j:["bin","trash","rubbish","garbage","toss"],k:[30,18],o:2},pregnant_woman:{a:"Pregnant Woman",b:"1F930",j:["baby"],k:[38,50],o:4},first_quarter_moon_with_face:{a:"First Quarter Moon with Face",b:"1F31B",j:["nature","twilight","planet","space","night","evening","sleep"],k:[5,46],o:2},"flag-nc":{a:"New Caledonia Flag",b:"1F1F3-1F1E8",k:[3,26],o:2},u7121:{a:"Squared Cjk Unified Ideograph-7121",b:"1F21A",j:["nothing","chinese","kanji","japanese","orange-square"],k:[5,6],o:2},lock:{a:"Lock",b:"1F512",j:["security","password","padlock"],k:[27,46],o:2},"flag-ne":{a:"Niger Flag",b:"1F1F3-1F1EA",k:[3,27],o:2},last_quarter_moon_with_face:{a:"Last Quarter Moon with Face",b:"1F31C",j:["nature","twilight","planet","space","night","evening","sleep"],k:[5,47],o:2},"breast-feeding":{a:"Breast-Feeding",b:"1F931",k:[38,56],o:5},u7981:{a:"Squared Cjk Unified Ideograph-7981",b:"1F232",j:["kanji","japanese","chinese","forbidden","limit","restricted","red-square"],k:[5,8],o:2},accept:{a:"Circled Ideograph Accept",b:"1F251",j:["ok","good","chinese","kanji","agree","yes","orange-circle"],k:[5,18],o:2},angel:{a:"Baby Angel",b:"1F47C",j:["heaven","wings","halo"],k:[23,37],o:2},unlock:{a:"Open Lock",b:"1F513",j:["privacy","security"],k:[27,47],o:2},"flag-nf":{a:"Norfolk Island Flag",b:"1F1F3-1F1EB",k:[3,28],o:2},thermometer:{a:"Thermometer",b:"1F321-FE0F",c:"1F321",j:["weather","temperature","hot","cold"],k:[5,52],o:2},"flag-ng":{a:"Nigeria Flag",b:"1F1F3-1F1EC",k:[3,29],o:2},u7533:{a:"Squared Cjk Unified Ideograph-7533",b:"1F238",j:["chinese","japanese","kanji","orange-square"],k:[5,14],o:2},sunny:{a:"Black Sun with Rays",b:"2600-FE0F",c:"2600",j:["weather","nature","brightness","summer","beach","spring"],k:[52,49],o:2},lock_with_ink_pen:{a:"Lock with Ink Pen",b:"1F50F",j:["security","secret"],k:[27,43],o:2},santa:{a:"Father Christmas",b:"1F385",j:["festival","man","male","xmas","father christmas"],k:[7,36],o:2},closed_lock_with_key:{a:"Closed Lock with Key",b:"1F510",j:["security","privacy"],k:[27,44],o:2},u5408:{a:"Squared Cjk Unified Ideograph-5408",b:"1F234",j:["japanese","chinese","join","kanji","red-square"],k:[5,10],o:2},"flag-ni":{a:"Nicaragua Flag",b:"1F1F3-1F1EE",k:[3,30],o:2},mrs_claus:{a:"Mother Christmas",b:"1F936",j:["woman","female","xmas","mother christmas"],k:[39,29],n:["mother_christmas"],o:4},full_moon_with_face:{a:"Full Moon with Face",b:"1F31D",j:["nature","twilight","planet","space","night","evening","sleep"],k:[5,48],o:2},key:{a:"Key",b:"1F511",j:["lock","door","password"],k:[27,45],o:2},superhero:{a:"Superhero",b:"1F9B8",k:[43,30],o:11},"flag-nl":{a:"Netherlands Flag",b:"1F1F3-1F1F1",k:[3,31],o:2},u7a7a:{a:"Squared Cjk Unified Ideograph-7a7a",b:"1F233",j:["kanji","japanese","chinese","empty","sky","blue-square"],k:[5,9],o:2},sun_with_face:{a:"Sun with Face",b:"1F31E",j:["nature","morning","sky"],k:[5,49],o:2},male_superhero:{a:"Male Superhero",b:"1F9B8-200D-2642-FE0F",c:"1F9B8-200D-2642",k:[43,24],o:11},ringed_planet:{a:"Ringed Planet",b:"1FA90",k:[52,4],o:12},old_key:{a:"Old Key",b:"1F5DD-FE0F",c:"1F5DD",j:["lock","door","password"],k:[30,22],o:2},congratulations:{a:"Circled Ideograph Congratulation",b:"3297-FE0F",c:"3297",j:["chinese","kanji","japanese","red-circle"],k:[55,46],o:2},"flag-no":{a:"Norway Flag",b:"1F1F3-1F1F4",k:[3,32],o:2},star:{a:"White Medium Star",b:"2B50",j:["night","yellow"],k:[55,42],o:2},secret:{a:"Circled Ideograph Secret",b:"3299-FE0F",c:"3299",j:["privacy","chinese","sshh","kanji","red-circle"],k:[55,47],o:2},"flag-np":{a:"Nepal Flag",b:"1F1F3-1F1F5",k:[3,33],o:2},female_superhero:{a:"Female Superhero",b:"1F9B8-200D-2640-FE0F",c:"1F9B8-200D-2640",k:[43,18],o:11},hammer:{a:"Hammer",b:"1F528",j:["tools","build","create"],k:[28,11],o:2},star2:{a:"Glowing Star",b:"1F31F",j:["night","sparkle","awesome","good","magic"],k:[5,50],o:2},"flag-nr":{a:"Nauru Flag",b:"1F1F3-1F1F7",k:[3,34],o:2},axe:{a:"Axe",b:"1FA93",k:[52,7],o:12},u55b6:{a:"Squared Cjk Unified Ideograph-55b6",b:"1F23A",j:["japanese","opening hours","orange-square"],k:[5,16],o:2},supervillain:{a:"Supervillain",b:"1F9B9",k:[43,48],o:11},stars:{a:"Shooting Star",b:"1F320",j:["night","photo"],k:[5,51],o:2},u6e80:{a:"Squared Cjk Unified Ideograph-6e80",b:"1F235",j:["full","chinese","japanese","red-square","kanji"],k:[5,11],o:2},"flag-nu":{a:"Niue Flag",b:"1F1F3-1F1FA",k:[3,35],o:2},pick:{a:"Pick",b:"26CF-FE0F",c:"26CF",j:["tools","dig"],k:[54,5],o:2},male_supervillain:{a:"Male Supervillain",b:"1F9B9-200D-2642-FE0F",c:"1F9B9-200D-2642",k:[43,42],o:11},female_supervillain:{a:"Female Supervillain",b:"1F9B9-200D-2640-FE0F",c:"1F9B9-200D-2640",k:[43,36],o:11},hammer_and_pick:{a:"Hammer and Pick",b:"2692-FE0F",c:"2692",j:["tools","build","create"],k:[53,41],o:2},milky_way:{a:"Milky Way",b:"1F30C",j:["photo","space","stars"],k:[5,31],o:2},red_circle:{a:"Large Red Circle",b:"1F534",j:["shape","error","danger"],k:[28,23],o:2},"flag-nz":{a:"New Zealand Flag",b:"1F1F3-1F1FF",k:[3,36],o:2},large_orange_circle:{a:"Large Orange Circle",b:"1F7E0",k:[37,3],o:12},hammer_and_wrench:{a:"Hammer and Wrench",b:"1F6E0-FE0F",c:"1F6E0",j:["tools","build","create"],k:[36,42],o:2},"flag-om":{a:"Oman Flag",b:"1F1F4-1F1F2",k:[3,37],o:2},cloud:{a:"Cloud",b:"2601-FE0F",c:"2601",j:["weather","sky"],k:[52,50],o:2},mage:{obsoleted_by:"1F9D9-200D-2640-FE0F",a:"Mage",b:"1F9D9",k:[49,49],o:5},dagger_knife:{a:"Dagger Knife",b:"1F5E1-FE0F",c:"1F5E1",k:[30,24],o:2},partly_sunny:{a:"Sun Behind Cloud",b:"26C5",j:["weather","nature","cloudy","morning","fall","spring"],k:[54,2],o:2},large_yellow_circle:{a:"Large Yellow Circle",b:"1F7E1",k:[37,4],o:12},male_mage:{a:"Male Mage",b:"1F9D9-200D-2642-FE0F",c:"1F9D9-200D-2642",k:[49,43],o:5},"flag-pa":{a:"Panama Flag",b:"1F1F5-1F1E6",k:[3,38],o:2},thunder_cloud_and_rain:{a:"Thunder Cloud and Rain",b:"26C8-FE0F",c:"26C8",k:[54,3],o:2},large_green_circle:{a:"Large Green Circle",b:"1F7E2",k:[37,5],o:12},female_mage:{obsoletes:"1F9D9",a:"Female Mage",b:"1F9D9-200D-2640-FE0F",c:"1F9D9-200D-2640",k:[49,37],o:5},crossed_swords:{a:"Crossed Swords",b:"2694-FE0F",c:"2694",j:["weapon"],k:[53,43],o:2},"flag-pe":{a:"Peru Flag",b:"1F1F5-1F1EA",k:[3,39],o:2},gun:{a:"Pistol",b:"1F52B",j:["violence","weapon","pistol","revolver"],k:[28,14],o:2},mostly_sunny:{a:"Mostly Sunny",b:"1F324-FE0F",c:"1F324",k:[5,53],n:["sun_small_cloud"],o:2},fairy:{obsoleted_by:"1F9DA-200D-2640-FE0F",a:"Fairy",b:"1F9DA",k:[50,10],o:5},"flag-pf":{a:"French Polynesia Flag",b:"1F1F5-1F1EB",k:[3,40],o:2},large_blue_circle:{a:"Large Blue Circle",b:"1F535",j:["shape","icon","button"],k:[28,24],o:2},large_purple_circle:{a:"Large Purple Circle",b:"1F7E3",k:[37,6],o:12},bow_and_arrow:{a:"Bow and Arrow",b:"1F3F9",j:["sports"],k:[11,21],o:2},male_fairy:{a:"Male Fairy",b:"1F9DA-200D-2642-FE0F",c:"1F9DA-200D-2642",k:[50,4],o:5},barely_sunny:{a:"Barely Sunny",b:"1F325-FE0F",c:"1F325",k:[5,54],n:["sun_behind_cloud"],o:2},"flag-pg":{a:"Papua New Guinea Flag",b:"1F1F5-1F1EC",k:[3,41],o:2},shield:{a:"Shield",b:"1F6E1-FE0F",c:"1F6E1",j:["protection","security"],k:[36,43],o:2},partly_sunny_rain:{a:"Partly Sunny Rain",b:"1F326-FE0F",c:"1F326",k:[5,55],n:["sun_behind_rain_cloud"],o:2},large_brown_circle:{a:"Large Brown Circle",b:"1F7E4",k:[37,7],o:12},female_fairy:{obsoletes:"1F9DA",a:"Female Fairy",b:"1F9DA-200D-2640-FE0F",c:"1F9DA-200D-2640",k:[49,55],o:5},"flag-ph":{a:"Philippines Flag",b:"1F1F5-1F1ED",k:[3,42],o:2},"flag-pk":{a:"Pakistan Flag",b:"1F1F5-1F1F0",k:[3,43],o:2},black_circle:{a:"Medium Black Circle",b:"26AB",j:["shape","button","round"],k:[53,53],o:2},wrench:{a:"Wrench",b:"1F527",j:["tools","diy","ikea","fix","maintainer"],k:[28,10],o:2},vampire:{obsoleted_by:"1F9DB-200D-2640-FE0F",a:"Vampire",b:"1F9DB",k:[50,28],o:5},rain_cloud:{a:"Rain Cloud",b:"1F327-FE0F",c:"1F327",k:[5,56],o:2},snow_cloud:{a:"Snow Cloud",b:"1F328-FE0F",c:"1F328",k:[6,0],o:2},"flag-pl":{a:"Poland Flag",b:"1F1F5-1F1F1",k:[3,44],o:2},male_vampire:{a:"Male Vampire",b:"1F9DB-200D-2642-FE0F",c:"1F9DB-200D-2642",k:[50,22],o:5},nut_and_bolt:{a:"Nut and Bolt",b:"1F529",j:["handy","tools","fix"],k:[28,12],o:2},white_circle:{a:"Medium White Circle",b:"26AA",j:["shape","round"],k:[53,52],o:2},female_vampire:{obsoletes:"1F9DB",a:"Female Vampire",b:"1F9DB-200D-2640-FE0F",c:"1F9DB-200D-2640",k:[50,16],o:5},"flag-pm":{a:"St. Pierre & Miquelon Flag",b:"1F1F5-1F1F2",k:[3,45],o:2},large_red_square:{a:"Large Red Square",b:"1F7E5",k:[37,8],o:12},lightning:{a:"Lightning",b:"1F329-FE0F",c:"1F329",k:[6,1],n:["lightning_cloud"],o:2},gear:{a:"Gear",b:"2699-FE0F",c:"2699",j:["cog"],k:[53,47],o:2},merperson:{obsoleted_by:"1F9DC-200D-2642-FE0F",a:"Merperson",b:"1F9DC",k:[50,46],o:5},tornado:{a:"Tornado",b:"1F32A-FE0F",c:"1F32A",j:["weather","cyclone","twister"],k:[6,2],n:["tornado_cloud"],o:2},large_orange_square:{a:"Large Orange Square",b:"1F7E7",k:[37,10],o:12},"flag-pn":{a:"Pitcairn Islands Flag",b:"1F1F5-1F1F3",k:[3,46],o:2},compression:{a:"Compression",b:"1F5DC-FE0F",c:"1F5DC",k:[30,21],o:2},merman:{obsoletes:"1F9DC",a:"Merman",b:"1F9DC-200D-2642-FE0F",c:"1F9DC-200D-2642",k:[50,40],o:5},large_yellow_square:{a:"Large Yellow Square",b:"1F7E8",k:[37,11],o:12},fog:{a:"Fog",b:"1F32B-FE0F",c:"1F32B",j:["weather"],k:[6,3],o:2},scales:{a:"Scales",b:"2696-FE0F",c:"2696",k:[53,45],o:2},"flag-pr":{a:"Puerto Rico Flag",b:"1F1F5-1F1F7",k:[3,47],o:2},wind_blowing_face:{a:"Wind Blowing Face",b:"1F32C-FE0F",c:"1F32C",k:[6,4],o:2},"flag-ps":{a:"Palestinian Territories Flag",b:"1F1F5-1F1F8",k:[3,48],o:2},mermaid:{a:"Mermaid",b:"1F9DC-200D-2640-FE0F",c:"1F9DC-200D-2640",k:[50,34],o:5},probing_cane:{a:"Probing Cane",b:"1F9AF",k:[43,3],o:12},large_green_square:{a:"Large Green Square",b:"1F7E9",k:[37,12],o:12},"flag-pt":{a:"Portugal Flag",b:"1F1F5-1F1F9",k:[3,49],o:2},link:{a:"Link Symbol",b:"1F517",j:["rings","url"],k:[27,51],o:2},large_blue_square:{a:"Large Blue Square",b:"1F7E6",k:[37,9],o:12},elf:{obsoleted_by:"1F9DD-200D-2642-FE0F",a:"Elf",b:"1F9DD",k:[51,7],o:5},cyclone:{a:"Cyclone",b:"1F300",j:["weather","swirl","blue","cloud","vortex","spiral","whirlpool","spin","tornado","hurricane","typhoon"],k:[5,19],o:2},rainbow:{a:"Rainbow",b:"1F308",j:["nature","happy","unicorn_face","photo","sky","spring"],k:[5,27],o:2},male_elf:{obsoletes:"1F9DD",a:"Male Elf",b:"1F9DD-200D-2642-FE0F",c:"1F9DD-200D-2642",k:[51,1],o:5},"flag-pw":{a:"Palau Flag",b:"1F1F5-1F1FC",k:[3,50],o:2},chains:{a:"Chains",b:"26D3-FE0F",c:"26D3",j:["lock","arrest"],k:[54,7],o:2},large_purple_square:{a:"Large Purple Square",b:"1F7EA",k:[37,13],o:12},female_elf:{a:"Female Elf",b:"1F9DD-200D-2640-FE0F",c:"1F9DD-200D-2640",k:[50,52],o:5},"flag-py":{a:"Paraguay Flag",b:"1F1F5-1F1FE",k:[3,51],o:2},closed_umbrella:{a:"Closed Umbrella",b:"1F302",j:["weather","rain","drizzle"],k:[5,21],o:2},toolbox:{a:"Toolbox",b:"1F9F0",k:[51,35],o:11},large_brown_square:{a:"Large Brown Square",b:"1F7EB",k:[37,14],o:12},magnet:{a:"Magnet",b:"1F9F2",k:[51,37],o:11},genie:{obsoleted_by:"1F9DE-200D-2642-FE0F",a:"Genie",b:"1F9DE",k:[51,15],o:5},"flag-qa":{a:"Qatar Flag",b:"1F1F6-1F1E6",k:[3,52],o:2},umbrella:{a:"Umbrella",b:"2602-FE0F",c:"2602",j:["rainy","weather","spring"],k:[52,51],o:2},black_large_square:{a:"Black Large Square",b:"2B1B",j:["shape","icon","button"],k:[55,40],o:2},male_genie:{obsoletes:"1F9DE",a:"Male Genie",b:"1F9DE-200D-2642-FE0F",c:"1F9DE-200D-2642",k:[51,14],o:5},umbrella_with_rain_drops:{a:"Umbrella with Rain Drops",b:"2614",k:[52,56],o:2},"flag-re":{a:"Réunion Flag",b:"1F1F7-1F1EA",k:[3,53],o:2},white_large_square:{a:"White Large Square",b:"2B1C",j:["shape","icon","stone","button"],k:[55,41],o:2},alembic:{a:"Alembic",b:"2697-FE0F",c:"2697",j:["distilling","science","experiment","chemistry"],k:[53,46],o:2},black_medium_square:{a:"Black Medium Square",b:"25FC-FE0F",c:"25FC",j:["shape","button","icon"],k:[52,46],o:2},test_tube:{a:"Test Tube",b:"1F9EA",k:[51,29],o:11},"flag-ro":{a:"Romania Flag",b:"1F1F7-1F1F4",k:[3,54],o:2},female_genie:{a:"Female Genie",b:"1F9DE-200D-2640-FE0F",c:"1F9DE-200D-2640",k:[51,13],o:5},umbrella_on_ground:{a:"Umbrella on Ground",b:"26F1-FE0F",c:"26F1",k:[54,12],o:2},zombie:{obsoleted_by:"1F9DF-200D-2642-FE0F",a:"Zombie",b:"1F9DF",k:[51,18],o:5},zap:{a:"High Voltage Sign",b:"26A1",j:["thunder","weather","lightning bolt","fast"],k:[53,51],o:2},white_medium_square:{a:"White Medium Square",b:"25FB-FE0F",c:"25FB",j:["shape","stone","icon"],k:[52,45],o:2},"flag-rs":{a:"Serbia Flag",b:"1F1F7-1F1F8",k:[3,55],o:2},petri_dish:{a:"Petri Dish",b:"1F9EB",k:[51,30],o:11},snowflake:{a:"Snowflake",b:"2744-FE0F",c:"2744",j:["winter","season","cold","weather","christmas","xmas"],k:[55,19],o:2},dna:{a:"Dna Double Helix",b:"1F9EC",k:[51,31],o:11},male_zombie:{obsoletes:"1F9DF",a:"Male Zombie",b:"1F9DF-200D-2642-FE0F",c:"1F9DF-200D-2642",k:[51,17],o:5},black_medium_small_square:{a:"Black Medium Small Square",b:"25FE",j:["icon","shape","button"],k:[52,48],o:2},ru:{a:"Russia Flag",b:"1F1F7-1F1FA",j:["russian","federation","flag","nation","country","banner"],k:[3,56],n:["flag-ru"],o:2},female_zombie:{a:"Female Zombie",b:"1F9DF-200D-2640-FE0F",c:"1F9DF-200D-2640",k:[51,16],o:5},"flag-rw":{a:"Rwanda Flag",b:"1F1F7-1F1FC",k:[4,0],o:2},snowman:{a:"Snowman",b:"2603-FE0F",c:"2603",j:["winter","season","cold","weather","christmas","xmas","frozen","without_snow"],k:[52,52],o:2},white_medium_small_square:{a:"White Medium Small Square",b:"25FD",j:["shape","stone","icon","button"],k:[52,47],o:2},microscope:{a:"Microscope",b:"1F52C",j:["laboratory","experiment","zoomin","science","study"],k:[28,15],o:2},snowman_without_snow:{a:"Snowman Without Snow",b:"26C4",k:[54,1],o:2},telescope:{a:"Telescope",b:"1F52D",j:["stars","space","zoom","science","astronomy"],k:[28,16],o:2},black_small_square:{a:"Black Small Square",b:"25AA-FE0F",c:"25AA",j:["shape","icon"],k:[52,41],o:2},"flag-sa":{a:"Saudi Arabia Flag",b:"1F1F8-1F1E6",k:[4,1],o:2},"man-getting-massage":{a:"Man Getting Massage",b:"1F486-200D-2642-FE0F",c:"1F486-200D-2642",k:[24,45],o:4},comet:{a:"Comet",b:"2604-FE0F",c:"2604",j:["space"],k:[52,53],o:2},white_small_square:{a:"White Small Square",b:"25AB-FE0F",c:"25AB",j:["shape","icon"],k:[52,42],o:2},"flag-sb":{a:"Solomon Islands Flag",b:"1F1F8-1F1E7",k:[4,2],o:2},satellite_antenna:{a:"Satellite Antenna",b:"1F4E1",k:[26,55],o:2},large_orange_diamond:{a:"Large Orange Diamond",b:"1F536",j:["shape","jewel","gem"],k:[28,25],o:2},"woman-getting-massage":{obsoletes:"1F486",a:"Woman Getting Massage",b:"1F486-200D-2640-FE0F",c:"1F486-200D-2640",k:[24,39],o:4},fire:{a:"Fire",b:"1F525",j:["hot","cook","flame"],k:[28,8],o:2},syringe:{a:"Syringe",b:"1F489",j:["health","hospital","drugs","blood","medicine","needle","doctor","nurse"],k:[25,19],o:2},"flag-sc":{a:"Seychelles Flag",b:"1F1F8-1F1E8",k:[4,3],o:2},large_blue_diamond:{a:"Large Blue Diamond",b:"1F537",j:["shape","jewel","gem"],k:[28,26],o:2},"flag-sd":{a:"Sudan Flag",b:"1F1F8-1F1E9",k:[4,4],o:2},droplet:{a:"Droplet",b:"1F4A7",j:["water","drip","faucet","spring"],k:[25,49],o:2},drop_of_blood:{a:"Drop of Blood",b:"1FA78",k:[51,55],o:12},ocean:{a:"Water Wave",b:"1F30A",j:["sea","water","wave","nature","tsunami","disaster"],k:[5,29],o:2},"flag-se":{a:"Sweden Flag",b:"1F1F8-1F1EA",k:[4,5],o:2},"man-getting-haircut":{a:"Man Getting Haircut",b:"1F487-200D-2642-FE0F",c:"1F487-200D-2642",k:[25,6],o:4},small_orange_diamond:{a:"Small Orange Diamond",b:"1F538",j:["shape","jewel","gem"],k:[28,27],o:2},pill:{a:"Pill",b:"1F48A",j:["health","medicine","doctor","pharmacy","drug"],k:[25,20],o:2},"woman-getting-haircut":{obsoletes:"1F487",a:"Woman Getting Haircut",b:"1F487-200D-2640-FE0F",c:"1F487-200D-2640",k:[25,0],o:4},small_blue_diamond:{a:"Small Blue Diamond",b:"1F539",j:["shape","jewel","gem"],k:[28,28],o:2},"flag-sg":{a:"Singapore Flag",b:"1F1F8-1F1EC",k:[4,6],o:2},adhesive_bandage:{a:"Adhesive Bandage",b:"1FA79",k:[51,56],o:12},small_red_triangle:{a:"Up-Pointing Red Triangle",b:"1F53A",j:["shape","direction","up","top"],k:[28,29],o:2},"flag-sh":{a:"St. Helena Flag",b:"1F1F8-1F1ED",k:[4,7],o:2},stethoscope:{a:"Stethoscope",b:"1FA7A",k:[52,0],o:12},"man-walking":{obsoletes:"1F6B6",a:"Man Walking",b:"1F6B6-200D-2642-FE0F",c:"1F6B6-200D-2642",k:[35,53],o:4},"flag-si":{a:"Slovenia Flag",b:"1F1F8-1F1EE",k:[4,8],o:2},door:{a:"Door",b:"1F6AA",j:["house","entry","exit"],k:[35,1],o:2},small_red_triangle_down:{a:"Down-Pointing Red Triangle",b:"1F53B",j:["shape","direction","bottom"],k:[28,30],o:2},"flag-sj":{a:"Svalbard & Jan Mayen Flag",b:"1F1F8-1F1EF",k:[4,9],o:2},diamond_shape_with_a_dot_inside:{a:"Diamond Shape with a Dot Inside",b:"1F4A0",j:["jewel","blue","gem","crystal","fancy"],k:[25,42],o:2},"woman-walking":{a:"Woman Walking",b:"1F6B6-200D-2640-FE0F",c:"1F6B6-200D-2640",k:[35,47],o:4},bed:{a:"Bed",b:"1F6CF-FE0F",c:"1F6CF",j:["sleep","rest"],k:[36,37],o:2},radio_button:{a:"Radio Button",b:"1F518",j:["input","old","music","circle"],k:[27,52],o:2},"flag-sk":{a:"Slovakia Flag",b:"1F1F8-1F1F0",k:[4,10],o:2},standing_person:{a:"Standing Person",b:"1F9CD",k:[44,31],o:12},couch_and_lamp:{a:"Couch and Lamp",b:"1F6CB-FE0F",c:"1F6CB",j:["read","chill"],k:[36,28],o:2},man_standing:{a:"Man Standing",b:"1F9CD-200D-2642-FE0F",c:"1F9CD-200D-2642",k:[44,25],o:12},white_square_button:{a:"White Square Button",b:"1F533",j:["shape","input"],k:[28,22],o:2},"flag-sl":{a:"Sierra Leone Flag",b:"1F1F8-1F1F1",k:[4,11],o:2},chair:{a:"Chair",b:"1FA91",k:[52,5],o:12},toilet:{a:"Toilet",b:"1F6BD",j:["restroom","wc","washroom","bathroom","potty"],k:[36,14],o:2},black_square_button:{a:"Black Square Button",b:"1F532",j:["shape","input","frame"],k:[28,21],o:2},"flag-sm":{a:"San Marino Flag",b:"1F1F8-1F1F2",k:[4,12],o:2},woman_standing:{a:"Woman Standing",b:"1F9CD-200D-2640-FE0F",c:"1F9CD-200D-2640",k:[44,19],o:12},kneeling_person:{a:"Kneeling Person",b:"1F9CE",k:[44,49],o:12},shower:{a:"Shower",b:"1F6BF",j:["clean","water","bathroom"],k:[36,16],o:2},"flag-sn":{a:"Senegal Flag",b:"1F1F8-1F1F3",k:[4,13],o:2},bathtub:{a:"Bathtub",b:"1F6C1",j:["clean","shower","bathroom"],k:[36,23],o:2},"flag-so":{a:"Somalia Flag",b:"1F1F8-1F1F4",k:[4,14],o:2},man_kneeling:{a:"Man Kneeling",b:"1F9CE-200D-2642-FE0F",c:"1F9CE-200D-2642",k:[44,43],o:12},"flag-sr":{a:"Suriname Flag",b:"1F1F8-1F1F7",k:[4,15],o:2},woman_kneeling:{a:"Woman Kneeling",b:"1F9CE-200D-2640-FE0F",c:"1F9CE-200D-2640",k:[44,37],o:12},razor:{a:"Razor",b:"1FA92",k:[52,6],o:12},"flag-ss":{a:"South Sudan Flag",b:"1F1F8-1F1F8",k:[4,16],o:2},lotion_bottle:{a:"Lotion Bottle",b:"1F9F4",k:[51,39],o:11},"flag-st":{a:"São Tomé & Príncipe Flag",b:"1F1F8-1F1F9",k:[4,17],o:2},safety_pin:{a:"Safety Pin",b:"1F9F7",k:[51,42],o:11},man_with_probing_cane:{a:"Man with Probing Cane",b:"1F468-200D-1F9AF",k:[16,17],o:12},broom:{a:"Broom",b:"1F9F9",k:[51,44],o:11},woman_with_probing_cane:{a:"Woman with Probing Cane",b:"1F469-200D-1F9AF",k:[19,2],o:12},"flag-sv":{a:"El Salvador Flag",b:"1F1F8-1F1FB",k:[4,18],o:2},"flag-sx":{a:"Sint Maarten Flag",b:"1F1F8-1F1FD",k:[4,19],o:2},basket:{a:"Basket",b:"1F9FA",k:[51,45],o:11},man_in_motorized_wheelchair:{a:"Man in Motorized Wheelchair",b:"1F468-200D-1F9BC",k:[16,47],o:12},"flag-sy":{a:"Syria Flag",b:"1F1F8-1F1FE",k:[4,20],o:2},roll_of_paper:{a:"Roll of Paper",b:"1F9FB",k:[51,46],o:11},woman_in_motorized_wheelchair:{a:"Woman in Motorized Wheelchair",b:"1F469-200D-1F9BC",k:[19,32],o:12},"flag-sz":{a:"Eswatini Flag",b:"1F1F8-1F1FF",k:[4,21],o:2},soap:{a:"Bar of Soap",b:"1F9FC",k:[51,47],o:11},"flag-ta":{a:"Tristan Da Cunha Flag",b:"1F1F9-1F1E6",k:[4,22],o:2},sponge:{a:"Sponge",b:"1F9FD",k:[51,48],o:11},fire_extinguisher:{a:"Fire Extinguisher",b:"1F9EF",k:[51,34],o:11},man_in_manual_wheelchair:{a:"Man in Manual Wheelchair",b:"1F468-200D-1F9BD",k:[16,53],o:12},"flag-tc":{a:"Turks & Caicos Islands Flag",b:"1F1F9-1F1E8",k:[4,23],o:2},woman_in_manual_wheelchair:{a:"Woman in Manual Wheelchair",b:"1F469-200D-1F9BD",k:[19,38],o:12},"flag-td":{a:"Chad Flag",b:"1F1F9-1F1E9",k:[4,24],o:2},shopping_trolley:{a:"Shopping Trolley",b:"1F6D2",k:[36,40],o:4},"flag-tf":{a:"French Southern Territories Flag",b:"1F1F9-1F1EB",k:[4,25],o:2},smoking:{a:"Smoking Symbol",b:"1F6AC",j:["kills","tobacco","cigarette","joint","smoke"],k:[35,3],o:2},coffin:{a:"Coffin",b:"26B0-FE0F",c:"26B0",j:["vampire","dead","die","death","rip","graveyard","cemetery","casket","funeral","box"],k:[53,54],o:2},"man-running":{obsoletes:"1F3C3",a:"Man Running",b:"1F3C3-200D-2642-FE0F",c:"1F3C3-200D-2642",k:[8,52],o:4},"flag-tg":{a:"Togo Flag",b:"1F1F9-1F1EC",k:[4,26],o:2},"woman-running":{a:"Woman Running",b:"1F3C3-200D-2640-FE0F",c:"1F3C3-200D-2640",k:[8,46],o:4},funeral_urn:{a:"Funeral Urn",b:"26B1-FE0F",c:"26B1",j:["dead","die","death","rip","ashes"],k:[53,55],o:2},"flag-th":{a:"Thailand Flag",b:"1F1F9-1F1ED",k:[4,27],o:2},moyai:{a:"Moyai",b:"1F5FF",j:["rock","easter island","moai"],k:[30,34],o:2},"flag-tj":{a:"Tajikistan Flag",b:"1F1F9-1F1EF",k:[4,28],o:2},dancer:{a:"Dancer",b:"1F483",j:["female","girl","woman","fun"],k:[24,26],o:2},"flag-tk":{a:"Tokelau Flag",b:"1F1F9-1F1F0",k:[4,29],o:2},man_dancing:{a:"Man Dancing",b:"1F57A",j:["male","boy","fun","dancer"],k:[29,37],o:4},"flag-tl":{a:"Timor-Leste Flag",b:"1F1F9-1F1F1",k:[4,30],o:2},man_in_business_suit_levitating:{a:"Man in Business Suit Levitating",b:"1F574-FE0F",c:"1F574",k:[29,9],o:2},"flag-tm":{a:"Turkmenistan Flag",b:"1F1F9-1F1F2",k:[4,31],o:2},dancers:{obsoleted_by:"1F46F-200D-2640-FE0F",a:"Woman with Bunny Ears",b:"1F46F",k:[22,0],o:2},"man-with-bunny-ears-partying":{a:"Man with Bunny Ears Partying",b:"1F46F-200D-2642-FE0F",c:"1F46F-200D-2642",k:[21,56],o:4},"flag-tn":{a:"Tunisia Flag",b:"1F1F9-1F1F3",k:[4,32],o:2},"flag-to":{a:"Tonga Flag",b:"1F1F9-1F1F4",k:[4,33],o:2},"woman-with-bunny-ears-partying":{obsoletes:"1F46F",a:"Woman with Bunny Ears Partying",b:"1F46F-200D-2640-FE0F",c:"1F46F-200D-2640",k:[21,55],o:4},"flag-tr":{a:"Turkey Flag",b:"1F1F9-1F1F7",k:[4,34],o:2},person_in_steamy_room:{obsoleted_by:"1F9D6-200D-2642-FE0F",a:"Person in Steamy Room",b:"1F9D6",k:[48,52],o:5},man_in_steamy_room:{obsoletes:"1F9D6",a:"Man in Steamy Room",b:"1F9D6-200D-2642-FE0F",c:"1F9D6-200D-2642",k:[48,46],o:5},"flag-tt":{a:"Trinidad & Tobago Flag",b:"1F1F9-1F1F9",k:[4,35],o:2},woman_in_steamy_room:{a:"Woman in Steamy Room",b:"1F9D6-200D-2640-FE0F",c:"1F9D6-200D-2640",k:[48,40],o:5},"flag-tv":{a:"Tuvalu Flag",b:"1F1F9-1F1FB",k:[4,36],o:2},"flag-tw":{a:"Taiwan Flag",b:"1F1F9-1F1FC",k:[4,37],o:2},person_climbing:{obsoleted_by:"1F9D7-200D-2640-FE0F",a:"Person Climbing",b:"1F9D7",k:[49,13],o:5},man_climbing:{a:"Man Climbing",b:"1F9D7-200D-2642-FE0F",c:"1F9D7-200D-2642",k:[49,7],o:5},"flag-tz":{a:"Tanzania Flag",b:"1F1F9-1F1FF",k:[4,38],o:2},"flag-ua":{a:"Ukraine Flag",b:"1F1FA-1F1E6",k:[4,39],o:2},woman_climbing:{obsoletes:"1F9D7",a:"Woman Climbing",b:"1F9D7-200D-2640-FE0F",c:"1F9D7-200D-2640",k:[49,1],o:5},"flag-ug":{a:"Uganda Flag",b:"1F1FA-1F1EC",k:[4,40],o:2},fencer:{a:"Fencer",b:"1F93A",k:[40,32],o:4},"flag-um":{a:"U.s. Outlying Islands Flag",b:"1F1FA-1F1F2",k:[4,41],o:2},horse_racing:{a:"Horse Racing",b:"1F3C7",j:["animal","betting","competition","gambling","luck"],k:[9,27],o:2},skier:{a:"Skier",b:"26F7-FE0F",c:"26F7",j:["sports","winter","snow"],k:[54,17],o:2},"flag-un":{a:"United Nations Flag",b:"1F1FA-1F1F3",k:[4,42],o:4},us:{a:"United States Flag",b:"1F1FA-1F1F8",j:["united","states","america","flag","nation","country","banner"],k:[4,43],n:["flag-us"],o:2},snowboarder:{a:"Snowboarder",b:"1F3C2",j:["sports","winter"],k:[8,40],o:2},"flag-uy":{a:"Uruguay Flag",b:"1F1FA-1F1FE",k:[4,44],o:2},"flag-uz":{a:"Uzbekistan Flag",b:"1F1FA-1F1FF",k:[4,45],o:2},"flag-va":{a:"Vatican City Flag",b:"1F1FB-1F1E6",k:[4,46],o:2},"flag-vc":{a:"St. Vincent & Grenadines Flag",b:"1F1FB-1F1E8",k:[4,47],o:2},"man-surfing":{obsoletes:"1F3C4",a:"Man Surfing",b:"1F3C4-200D-2642-FE0F",c:"1F3C4-200D-2642",k:[9,13],o:4},"flag-ve":{a:"Venezuela Flag",b:"1F1FB-1F1EA",k:[4,48],o:2},"flag-vg":{a:"British Virgin Islands Flag",b:"1F1FB-1F1EC",k:[4,49],o:2},"woman-surfing":{a:"Woman Surfing",b:"1F3C4-200D-2640-FE0F",c:"1F3C4-200D-2640",k:[9,7],o:4},"flag-vi":{a:"U.s. Virgin Islands Flag",b:"1F1FB-1F1EE",k:[4,50],o:2},"man-rowing-boat":{obsoletes:"1F6A3",a:"Man Rowing Boat",b:"1F6A3-200D-2642-FE0F",c:"1F6A3-200D-2642",k:[34,40],o:4},"flag-vn":{a:"Vietnam Flag",b:"1F1FB-1F1F3",k:[4,51],o:2},"flag-vu":{a:"Vanuatu Flag",b:"1F1FB-1F1FA",k:[4,52],o:2},"woman-rowing-boat":{a:"Woman Rowing Boat",b:"1F6A3-200D-2640-FE0F",c:"1F6A3-200D-2640",k:[34,34],o:4},"flag-wf":{a:"Wallis & Futuna Flag",b:"1F1FC-1F1EB",k:[4,53],o:2},"man-swimming":{obsoletes:"1F3CA",a:"Man Swimming",b:"1F3CA-200D-2642-FE0F",c:"1F3CA-200D-2642",k:[9,41],o:4},"flag-ws":{a:"Samoa Flag",b:"1F1FC-1F1F8",k:[4,54],o:2},"woman-swimming":{a:"Woman Swimming",b:"1F3CA-200D-2640-FE0F",c:"1F3CA-200D-2640",k:[9,35],o:4},"flag-xk":{a:"Kosovo Flag",b:"1F1FD-1F1F0",k:[4,55],o:2},"flag-ye":{a:"Yemen Flag",b:"1F1FE-1F1EA",k:[4,56],o:2},"flag-yt":{a:"Mayotte Flag",b:"1F1FE-1F1F9",k:[5,0],o:2},"flag-za":{a:"South Africa Flag",b:"1F1FF-1F1E6",k:[5,1],o:2},"flag-zm":{a:"Zambia Flag",b:"1F1FF-1F1F2",k:[5,2],o:2},"flag-zw":{a:"Zimbabwe Flag",b:"1F1FF-1F1FC",k:[5,3],o:2},"flag-england":{a:"England Flag",b:"1F3F4-E0067-E0062-E0065-E006E-E0067-E007F",k:[11,14],o:5},"flag-scotland":{a:"Scotland Flag",b:"1F3F4-E0067-E0062-E0073-E0063-E0074-E007F",k:[11,15],o:5},"flag-wales":{a:"Wales Flag",b:"1F3F4-E0067-E0062-E0077-E006C-E0073-E007F",k:[11,16],o:5},"man-biking":{obsoletes:"1F6B4",a:"Man Biking",b:"1F6B4-200D-2642-FE0F",c:"1F6B4-200D-2642",k:[35,17],o:4},"woman-biking":{a:"Woman Biking",b:"1F6B4-200D-2640-FE0F",c:"1F6B4-200D-2640",k:[35,11],o:4},"man-mountain-biking":{obsoletes:"1F6B5",a:"Man Mountain Biking",b:"1F6B5-200D-2642-FE0F",c:"1F6B5-200D-2642",k:[35,35],o:4},"woman-mountain-biking":{a:"Woman Mountain Biking",b:"1F6B5-200D-2640-FE0F",c:"1F6B5-200D-2640",k:[35,29],o:4},"man-cartwheeling":{a:"Man Cartwheeling",b:"1F938-200D-2642-FE0F",c:"1F938-200D-2642",k:[40,2],o:4},"woman-cartwheeling":{a:"Woman Cartwheeling",b:"1F938-200D-2640-FE0F",c:"1F938-200D-2640",k:[39,53],o:4},wrestlers:{a:"Wrestlers",b:"1F93C",k:[40,35],o:4},"man-wrestling":{a:"Man Wrestling",b:"1F93C-200D-2642-FE0F",c:"1F93C-200D-2642",k:[40,34],o:4},"woman-wrestling":{a:"Woman Wrestling",b:"1F93C-200D-2640-FE0F",c:"1F93C-200D-2640",k:[40,33],o:4},"man-playing-water-polo":{a:"Man Playing Water Polo",b:"1F93D-200D-2642-FE0F",c:"1F93D-200D-2642",k:[40,42],o:4},"woman-playing-water-polo":{a:"Woman Playing Water Polo",b:"1F93D-200D-2640-FE0F",c:"1F93D-200D-2640",k:[40,36],o:4},"man-playing-handball":{a:"Man Playing Handball",b:"1F93E-200D-2642-FE0F",c:"1F93E-200D-2642",k:[41,3],o:4},"woman-playing-handball":{a:"Woman Playing Handball",b:"1F93E-200D-2640-FE0F",c:"1F93E-200D-2640",k:[40,54],o:4},juggling:{a:"Juggling",b:"1F939",k:[40,26],o:4},"man-juggling":{a:"Man Juggling",b:"1F939-200D-2642-FE0F",c:"1F939-200D-2642",k:[40,20],o:4},"woman-juggling":{a:"Woman Juggling",b:"1F939-200D-2640-FE0F",c:"1F939-200D-2640",k:[40,14],o:4},person_in_lotus_position:{obsoleted_by:"1F9D8-200D-2640-FE0F",a:"Person in Lotus Position",b:"1F9D8",k:[49,31],o:5},man_in_lotus_position:{a:"Man in Lotus Position",b:"1F9D8-200D-2642-FE0F",c:"1F9D8-200D-2642",k:[49,25],o:5},woman_in_lotus_position:{obsoletes:"1F9D8",a:"Woman in Lotus Position",b:"1F9D8-200D-2640-FE0F",c:"1F9D8-200D-2640",k:[49,19],o:5},bath:{a:"Bath",b:"1F6C0",j:["clean","shower","bathroom"],k:[36,17],o:2},sleeping_accommodation:{a:"Sleeping Accommodation",b:"1F6CC",k:[36,29],o:2},people_holding_hands:{a:"People Holding Hands",b:"1F9D1-200D-1F91D-200D-1F9D1",k:[46,38],o:12},two_women_holding_hands:{a:"Two Women Holding Hands",b:"1F46D",j:["pair","friendship","couple","love","like","female","people","human"],k:[21,11],n:["women_holding_hands"],o:2},couple:{a:"Man and Woman Holding Hands",b:"1F46B",j:["pair","people","human","love","date","dating","like","affection","valentines","marriage"],k:[20,16],n:["man_and_woman_holding_hands","woman_and_man_holding_hands"],o:2},two_men_holding_hands:{a:"Two Men Holding Hands",b:"1F46C",j:["pair","couple","love","like","bromance","friendship","people","human"],k:[20,42],n:["men_holding_hands"],o:2},couplekiss:{obsoleted_by:"1F469-200D-2764-FE0F-200D-1F48B-200D-1F468",a:"Kiss",b:"1F48F",k:[25,25],o:2},"woman-kiss-man":{obsoletes:"1F48F",a:"Woman Kiss Man",b:"1F469-200D-2764-FE0F-200D-1F48B-200D-1F468",c:"1F469-200D-2764-200D-1F48B-200D-1F468",k:[20,7],o:2},"man-kiss-man":{a:"Man Kiss Man",b:"1F468-200D-2764-FE0F-200D-1F48B-200D-1F468",c:"1F468-200D-2764-200D-1F48B-200D-1F468",k:[17,21],o:2},"woman-kiss-woman":{a:"Woman Kiss Woman",b:"1F469-200D-2764-FE0F-200D-1F48B-200D-1F469",c:"1F469-200D-2764-200D-1F48B-200D-1F469",k:[20,8],o:2},couple_with_heart:{obsoleted_by:"1F469-200D-2764-FE0F-200D-1F468",a:"Couple with Heart",b:"1F491",k:[25,27],o:2},"woman-heart-man":{obsoletes:"1F491",a:"Woman Heart Man",b:"1F469-200D-2764-FE0F-200D-1F468",c:"1F469-200D-2764-200D-1F468",k:[20,5],o:2},"man-heart-man":{a:"Man Heart Man",b:"1F468-200D-2764-FE0F-200D-1F468",c:"1F468-200D-2764-200D-1F468",k:[17,20],o:2},"woman-heart-woman":{a:"Woman Heart Woman",b:"1F469-200D-2764-FE0F-200D-1F469",c:"1F469-200D-2764-200D-1F469",k:[20,6],o:2},family:{obsoleted_by:"1F468-200D-1F469-200D-1F466",a:"Family",b:"1F46A",k:[20,15],n:["man-woman-boy"],o:2},"man-woman-boy":{obsoletes:"1F46A",a:"Man Woman Boy",b:"1F468-200D-1F469-200D-1F466",k:[15,33],n:["family"],o:2},"man-woman-girl":{a:"Man Woman Girl",b:"1F468-200D-1F469-200D-1F467",k:[15,35],o:2},"man-woman-girl-boy":{a:"Man Woman Girl Boy",b:"1F468-200D-1F469-200D-1F467-200D-1F466",k:[15,36],o:2},"man-woman-boy-boy":{a:"Man Woman Boy Boy",b:"1F468-200D-1F469-200D-1F466-200D-1F466",k:[15,34],o:2},"man-woman-girl-girl":{a:"Man Woman Girl Girl",b:"1F468-200D-1F469-200D-1F467-200D-1F467",k:[15,37],o:2},"man-man-boy":{a:"Man Man Boy",b:"1F468-200D-1F468-200D-1F466",k:[15,28],o:2},"man-man-girl":{a:"Man Man Girl",b:"1F468-200D-1F468-200D-1F467",k:[15,30],o:2},"man-man-girl-boy":{a:"Man Man Girl Boy",b:"1F468-200D-1F468-200D-1F467-200D-1F466",k:[15,31],o:2},"man-man-boy-boy":{a:"Man Man Boy Boy",b:"1F468-200D-1F468-200D-1F466-200D-1F466",k:[15,29],o:2},"man-man-girl-girl":{a:"Man Man Girl Girl",b:"1F468-200D-1F468-200D-1F467-200D-1F467",k:[15,32],o:2},"woman-woman-boy":{a:"Woman Woman Boy",b:"1F469-200D-1F469-200D-1F466",k:[18,18],o:2},"woman-woman-girl":{a:"Woman Woman Girl",b:"1F469-200D-1F469-200D-1F467",k:[18,20],o:2},"woman-woman-girl-boy":{a:"Woman Woman Girl Boy",b:"1F469-200D-1F469-200D-1F467-200D-1F466",k:[18,21],o:2},"woman-woman-boy-boy":{a:"Woman Woman Boy Boy",b:"1F469-200D-1F469-200D-1F466-200D-1F466",k:[18,19],o:2},"woman-woman-girl-girl":{a:"Woman Woman Girl Girl",b:"1F469-200D-1F469-200D-1F467-200D-1F467",k:[18,22],o:2},"man-boy":{a:"Man Boy",b:"1F468-200D-1F466",k:[15,24],o:4},"man-boy-boy":{a:"Man Boy Boy",b:"1F468-200D-1F466-200D-1F466",k:[15,23],o:4},"man-girl":{a:"Man Girl",b:"1F468-200D-1F467",k:[15,27],o:4},"man-girl-boy":{a:"Man Girl Boy",b:"1F468-200D-1F467-200D-1F466",k:[15,25],o:4},"man-girl-girl":{a:"Man Girl Girl",b:"1F468-200D-1F467-200D-1F467",k:[15,26],o:4},"woman-boy":{a:"Woman Boy",b:"1F469-200D-1F466",k:[18,14],o:4},"woman-boy-boy":{a:"Woman Boy Boy",b:"1F469-200D-1F466-200D-1F466",k:[18,13],o:4},"woman-girl":{a:"Woman Girl",b:"1F469-200D-1F467",k:[18,17],o:4},"woman-girl-boy":{a:"Woman Girl Boy",b:"1F469-200D-1F467-200D-1F466",k:[18,15],o:4},"woman-girl-girl":{a:"Woman Girl Girl",b:"1F469-200D-1F467-200D-1F467",k:[18,16],o:4},speaking_head_in_silhouette:{a:"Speaking Head in Silhouette",b:"1F5E3-FE0F",c:"1F5E3",k:[30,25],o:2},bust_in_silhouette:{a:"Bust in Silhouette",b:"1F464",j:["user","person","human"],k:[14,24],o:2},busts_in_silhouette:{a:"Busts in Silhouette",b:"1F465",j:["user","person","human","group","team"],k:[14,25],o:2},footprints:{a:"Footprints",b:"1F463",j:["feet","tracking","walking","beach"],k:[14,23],o:2}};var aliases={raised_hand:"hand",satisfied:"laughing",tshirt:"shirt",hand_with_index_and_middle_fingers_crossed:"crossed_fingers",sign_of_the_horns:"the_horns",grinning_face_with_star_eyes:"star-struck",reversed_hand_with_middle_finger_extended:"middle_finger",thumbsup:"+1",thumbsdown:"-1",punch:"facepunch",grinning_face_with_one_large_and_one_small_eye:"zany_face",shoe:"mans_shoe",smiling_face_with_smiling_eyes_and_hand_covering_mouth:"face_with_hand_over_mouth",face_with_finger_covering_closed_lips:"shushing_face",face_with_one_eyebrow_raised:"face_with_raised_eyebrow",face_with_open_mouth_vomiting:"face_vomiting",cooking:"fried_egg","flag-cn":"cn",shocked_face_with_exploding_head:"exploding_head",paw_prints:"feet","flag-de":"de",telephone:"phone","flag-es":"es",red_car:"car",flipper:"dolphin","flag-fr":"fr",uk:"gb","flag-gb":"gb",serious_face_with_symbols_covering_mouth:"face_with_symbols_on_mouth",poop:"hankey",shit:"hankey",honeybee:"bee",staff_of_aesculapius:"medical_symbol",lantern:"izakaya_lantern",open_book:"book",sailboat:"boat",knife:"hocho","flag-it":"it",heavy_exclamation_mark:"exclamation","flag-jp":"jp",envelope:"email","flag-kr":"kr",collision:"boom",pencil:"memo",waxing_gibbous_moon:"moon",mother_christmas:"mrs_claus",sun_small_cloud:"mostly_sunny",sun_behind_cloud:"barely_sunny",sun_behind_rain_cloud:"partly_sunny_rain",lightning_cloud:"lightning",tornado_cloud:"tornado","flag-ru":"ru","flag-us":"us",women_holding_hands:"two_women_holding_hands",man_and_woman_holding_hands:"couple",woman_and_man_holding_hands:"couple",men_holding_hands:"two_men_holding_hands","man-woman-boy":"family",family:"man-woman-boy"};var defaultEmojiData = {compressed:compressed,categories:categories,emojis:emojis,aliases:aliases};

function ownKeys$7(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$7(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$7(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$7(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
/** @type {React.FC<import('../types').ChannelProps>}>} */

var Channel = function Channel(_ref) {
  var _ref$EmptyPlaceholder = _ref.EmptyPlaceholder,
      EmptyPlaceholder = _ref$EmptyPlaceholder === void 0 ? null : _ref$EmptyPlaceholder,
      props = _objectWithoutProperties(_ref, ["EmptyPlaceholder"]);

  var _useContext = useContext(ChatContext),
      contextChannel = _useContext.channel;

  var channel = props.channel || contextChannel;
  if (!(channel !== null && channel !== void 0 && channel.cid)) return EmptyPlaceholder;
  return /*#__PURE__*/React.createElement(ChannelInner, _extends({}, props, {
    channel: channel,
    key: channel.cid
  }));
};
/** @type {React.FC<import('../types').ChannelProps & { channel: import('stream-chat').Channel }>} */


var ChannelInner = function ChannelInner(_ref2) {
  var _props$channel;

  var _ref2$Attachment = _ref2.Attachment,
      Attachment$1 = _ref2$Attachment === void 0 ? Attachment : _ref2$Attachment,
      doMarkReadRequest = _ref2.doMarkReadRequest,
      _ref2$Emoji = _ref2.Emoji,
      Emoji = _ref2$Emoji === void 0 ? DefaultEmoji : _ref2$Emoji,
      _ref2$emojiData = _ref2.emojiData,
      emojiData = _ref2$emojiData === void 0 ? defaultEmojiData : _ref2$emojiData,
      _ref2$EmojiIndex = _ref2.EmojiIndex,
      EmojiIndex = _ref2$EmojiIndex === void 0 ? DefaultEmojiIndex : _ref2$EmojiIndex,
      _ref2$EmojiPicker = _ref2.EmojiPicker,
      EmojiPicker = _ref2$EmojiPicker === void 0 ? DefaultEmojiPicker : _ref2$EmojiPicker,
      _ref2$LoadingErrorInd = _ref2.LoadingErrorIndicator,
      LoadingErrorIndicator = _ref2$LoadingErrorInd === void 0 ? DefaultLoadingErrorIndicator : _ref2$LoadingErrorInd,
      _ref2$LoadingIndicato = _ref2.LoadingIndicator,
      LoadingIndicator = _ref2$LoadingIndicato === void 0 ? DefaultLoadingIndicator : _ref2$LoadingIndicato,
      _ref2$Message = _ref2.Message,
      Message = _ref2$Message === void 0 ? MessageSimple$1 : _ref2$Message,
      props = _objectWithoutProperties(_ref2, ["Attachment", "doMarkReadRequest", "Emoji", "emojiData", "EmojiIndex", "EmojiPicker", "LoadingErrorIndicator", "LoadingIndicator", "Message"]);

  var channel = props.channel;

  var _useContext2 = useContext(ChatContext),
      client = _useContext2.client,
      mutes = _useContext2.mutes,
      theme = _useContext2.theme;

  var _useContext3 = useContext(TranslationContext),
      t = _useContext3.t;

  var _useReducer = useReducer(channelReducer, initialState),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  var isMounted = useIsMounted();
  var originalTitle = useRef('');
  var lastRead = useRef(new Date());
  var online = useRef(true);
  var emojiConfig = {
    commonEmoji,
    defaultMinimalEmojis,
    Emoji,
    emojiData,
    EmojiIndex,
    EmojiPicker,
    emojiSetDef
  }; // eslint-disable-next-line react-hooks/exhaustive-deps

  var throttledCopyStateFromChannel = useCallback(throttle(function () {
    dispatch({
      type: 'copyStateFromChannelOnEvent',
      channel
    });
  }, 500, {
    leading: true,
    trailing: true
  }), [channel]);
  var markRead = useCallback(function () {
    var _channel$getConfig;

    if (channel.disconnected || !((_channel$getConfig = channel.getConfig()) !== null && _channel$getConfig !== void 0 && _channel$getConfig.read_events)) {
      return;
    }

    lastRead.current = new Date();

    if (doMarkReadRequest) {
      doMarkReadRequest(channel);
    } else {
      logChatPromiseExecution(channel.markRead(), 'mark read');
    }

    if (originalTitle.current) {
      document.title = originalTitle.current;
    }
  }, [channel, doMarkReadRequest]); // eslint-disable-next-line react-hooks/exhaustive-deps

  var markReadThrottled = useCallback(throttle(markRead, 500, {
    leading: true,
    trailing: true
  }), [markRead]);
  var handleEvent = useCallback(function (e) {
    dispatch({
      type: 'updateThreadOnEvent',
      message: e.message,
      channel
    });

    if (e.type === 'connection.changed') {
      online.current = e.online;
    }

    if (e.type === 'message.new') {
      var mainChannelUpdated = true;

      if (e.message.parent_id && !e.message.show_in_channel) {
        mainChannelUpdated = false;
      }

      if (mainChannelUpdated && e.message.user.id !== client.userID) {
        var _channel$getConfig2;

        if (!document.hidden) {
          markReadThrottled();
        } else if ((_channel$getConfig2 = channel.getConfig()) !== null && _channel$getConfig2 !== void 0 && _channel$getConfig2.read_events && !channel.muteStatus().muted) {
          var unread = channel.countUnread(lastRead.current);
          document.title = "(".concat(unread, ") ").concat(originalTitle.current);
        }
      }
    }

    throttledCopyStateFromChannel();
  }, [channel, throttledCopyStateFromChannel, client.userID, markReadThrottled]); // useLayoutEffect here to prevent spinner. Use Suspense when it is available in stable release

  useLayoutEffect(function () {
    var errored = false;
    var done = false;

    var onVisibilityChange = function onVisibilityChange() {
      if (!document.hidden) {
        markRead();
      }
    };

    _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (channel.initialized) {
                _context.next = 10;
                break;
              }

              _context.prev = 1;
              _context.next = 4;
              return channel.watch();

            case 4:
              _context.next = 10;
              break;

            case 6:
              _context.prev = 6;
              _context.t0 = _context["catch"](1);
              dispatch({
                type: 'setError',
                error: _context.t0
              });
              errored = true;

            case 10:
              done = true;
              originalTitle.current = document.title;

              if (!errored) {
                dispatch({
                  type: 'initStateFromChannel',
                  channel
                });
                if (channel.countUnread() > 0) markRead(); // The more complex sync logic is done in chat.js
                // listen to client.connection.recovered and all channel events

                document.addEventListener('visibilitychange', onVisibilityChange);
                client.on('connection.changed', handleEvent);
                client.on('connection.recovered', handleEvent);
                channel.on(handleEvent);
              }

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[1, 6]]);
    }))();

    return function () {
      if (errored || !done) return;
      document.removeEventListener('visibilitychange', onVisibilityChange);
      channel.off(handleEvent);
      client.off('connection.changed', handleEvent);
      client.off('connection.recovered', handleEvent);
    };
  }, [channel, client, handleEvent, markRead, props.channel]);
  useEffect(function () {
    if (state.thread) {
      for (var i = state.messages.length - 1; i >= 0; i -= 1) {
        if (state.messages[i].id === state.thread.id) {
          dispatch({
            type: 'setThread',
            message: state.messages[i]
          });
          break;
        }
      }
    }
  }, [state.messages, state.thread]); // Message
  // eslint-disable-next-line react-hooks/exhaustive-deps

  var loadMoreFinished = useCallback(debounce(
  /**
   * @param {boolean} hasMore
   * @param {import('stream-chat').ChannelState['messages']} messages
   */
  function (hasMore, messages) {
    if (!isMounted.current) return;
    dispatch({
      type: 'loadMoreFinished',
      hasMore,
      messages
    });
  }, 2000, {
    leading: true,
    trailing: true
  }), []);
  var loadMore = useCallback( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
    var limit,
        oldestMessage,
        oldestID,
        perPage,
        queryResponse,
        hasMoreMessages,
        _args2 = arguments;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            limit = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : 100;

            if (!(!online.current || !window.navigator.onLine)) {
              _context2.next = 3;
              break;
            }

            return _context2.abrupt("return", 0);

          case 3:
            // prevent duplicate loading events...
            oldestMessage = state.messages[0];

            if (!(state.loadingMore || (oldestMessage === null || oldestMessage === void 0 ? void 0 : oldestMessage.status) !== 'received')) {
              _context2.next = 6;
              break;
            }

            return _context2.abrupt("return", 0);

          case 6:
            dispatch({
              type: 'setLoadingMore',
              loadingMore: true
            });
            oldestID = oldestMessage === null || oldestMessage === void 0 ? void 0 : oldestMessage.id;
            perPage = limit;
            _context2.prev = 9;
            _context2.next = 12;
            return channel.query({
              messages: {
                limit: perPage,
                id_lt: oldestID
              }
            });

          case 12:
            queryResponse = _context2.sent;
            _context2.next = 20;
            break;

          case 15:
            _context2.prev = 15;
            _context2.t0 = _context2["catch"](9);
            console.warn('message pagination request failed with error', _context2.t0);
            dispatch({
              type: 'setLoadingMore',
              loadingMore: false
            });
            return _context2.abrupt("return", 0);

          case 20:
            hasMoreMessages = queryResponse.messages.length === perPage;
            loadMoreFinished(hasMoreMessages, channel.state.messages);
            return _context2.abrupt("return", queryResponse.messages.length);

          case 23:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[9, 15]]);
  })), [channel, loadMoreFinished, state.loadingMore, state.messages, online]);
  var updateMessage = useCallback(function (updatedMessage) {
    // adds the message to the local channel state..
    // this adds to both the main channel state as well as any reply threads
    channel.state.addMessageSorted(updatedMessage, true);
    dispatch({
      type: 'copyMessagesFromChannel',
      parentId: state.thread && updatedMessage.parent_id,
      channel
    });
  }, [channel, state.thread]);
  var doSendMessageRequest = props.doSendMessageRequest;
  var doSendMessage = useCallback( /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(message) {
      var text, attachments, id, parent_id, mentioned_users, messageData, messageResponse;
      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              text = message.text, attachments = message.attachments, id = message.id, parent_id = message.parent_id, mentioned_users = message.mentioned_users;
              messageData = {
                text,
                attachments,
                mentioned_users,
                id,
                parent_id
              };
              _context3.prev = 2;

              if (!doSendMessageRequest) {
                _context3.next = 9;
                break;
              }

              _context3.next = 6;
              return doSendMessageRequest(channel.cid, messageData);

            case 6:
              messageResponse = _context3.sent;
              _context3.next = 12;
              break;

            case 9:
              _context3.next = 11;
              return channel.sendMessage(messageData);

            case 11:
              messageResponse = _context3.sent;

            case 12:
              // replace it after send is completed
              if (messageResponse && messageResponse.message) {
                updateMessage(_objectSpread$7(_objectSpread$7({}, messageResponse.message), {}, {
                  status: 'received'
                }));
              }

              _context3.next = 18;
              break;

            case 15:
              _context3.prev = 15;
              _context3.t0 = _context3["catch"](2);
              // set the message to failed..
              updateMessage(_objectSpread$7(_objectSpread$7({}, message), {}, {
                status: 'failed'
              }));

            case 18:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[2, 15]]);
    }));

    return function (_x) {
      return _ref5.apply(this, arguments);
    };
  }(), [channel, doSendMessageRequest, updateMessage]);
  var createMessagePreview = useCallback(function (text, attachments, parent, mentioned_users) {
    // create a preview of the message
    var clientSideID = "".concat(client.userID, "-").concat(v4());
    return _objectSpread$7({
      text,
      html: text,
      __html: text,
      id: clientSideID,
      type: 'regular',
      status: 'sending',
      user: client.user,
      created_at: new Date(),
      attachments,
      mentioned_users,
      reactions: []
    }, parent !== null && parent !== void 0 && parent.id ? {
      parent_id: parent.id
    } : null);
  }, [client.user, client.userID]);
  var sendMessage = useCallback( /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(_ref6) {
      var text, _ref6$attachments, attachments, _ref6$mentioned_users, mentioned_users, parent, messagePreview;

      return _regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              text = _ref6.text, _ref6$attachments = _ref6.attachments, attachments = _ref6$attachments === void 0 ? [] : _ref6$attachments, _ref6$mentioned_users = _ref6.mentioned_users, mentioned_users = _ref6$mentioned_users === void 0 ? [] : _ref6$mentioned_users, parent = _ref6.parent;
              // remove error messages upon submit
              channel.state.filterErrorMessages(); // create a local preview message to show in the UI

              messagePreview = createMessagePreview(text, attachments, parent, mentioned_users); // first we add the message to the UI

              updateMessage(messagePreview);
              _context4.next = 6;
              return doSendMessage(messagePreview);

            case 6:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    return function (_x2) {
      return _ref7.apply(this, arguments);
    };
  }(), [channel.state, createMessagePreview, doSendMessage, updateMessage]);
  var retrySendMessage = useCallback( /*#__PURE__*/function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(message) {
      return _regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              // set the message status to sending
              updateMessage(_objectSpread$7(_objectSpread$7({}, message), {}, {
                status: 'sending'
              })); // actually try to send the message...

              _context5.next = 3;
              return doSendMessage(message);

            case 3:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    return function (_x3) {
      return _ref8.apply(this, arguments);
    };
  }(), [doSendMessage, updateMessage]);
  var removeMessage = useCallback(function (message) {
    channel.state.removeMessage(message);
    dispatch({
      type: 'copyMessagesFromChannel',
      parentId: state.thread && message.parent_id,
      channel
    });
  }, [channel, state.thread]); // Thread

  var openThread = useCallback(function (message, e) {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    dispatch({
      type: 'openThread',
      message,
      channel
    });
  }, [channel]); // eslint-disable-next-line react-hooks/exhaustive-deps

  var loadMoreThreadFinished = useCallback(debounce(
  /**
   * @param {boolean} threadHasMore
   * @param {Array<ReturnType<import('stream-chat').ChannelState['formatMessage']>>} threadMessages
   */
  function (threadHasMore, threadMessages) {
    dispatch({
      type: 'loadMoreThreadFinished',
      threadHasMore,
      threadMessages
    });
  }, 2000, {
    leading: true,
    trailing: true
  }), []);
  var loadMoreThread = useCallback( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6() {
    var _oldMessages$;

    var parentID, oldMessages, oldestMessageID, limit, queryResponse, threadHasMoreMessages, newThreadMessages;
    return _regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            if (!(state.threadLoadingMore || !state.thread)) {
              _context6.next = 2;
              break;
            }

            return _context6.abrupt("return");

          case 2:
            dispatch({
              type: 'startLoadingThread'
            });
            parentID = state.thread.id;

            if (parentID) {
              _context6.next = 7;
              break;
            }

            dispatch({
              type: 'closeThread'
            });
            return _context6.abrupt("return");

          case 7:
            oldMessages = channel.state.threads[parentID] || [];
            oldestMessageID = (_oldMessages$ = oldMessages[0]) === null || _oldMessages$ === void 0 ? void 0 : _oldMessages$.id;
            limit = 50;
            _context6.prev = 10;
            _context6.next = 13;
            return channel.getReplies(parentID, {
              limit,
              id_lt: oldestMessageID
            });

          case 13:
            queryResponse = _context6.sent;
            threadHasMoreMessages = queryResponse.messages.length === limit;
            newThreadMessages = channel.state.threads[parentID] || []; // next set loadingMore to false so we can start asking for more data...

            loadMoreThreadFinished(threadHasMoreMessages, newThreadMessages);
            _context6.next = 22;
            break;

          case 19:
            _context6.prev = 19;
            _context6.t0 = _context6["catch"](10);
            loadMoreThreadFinished(false, oldMessages);

          case 22:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[10, 19]]);
  })), [channel, loadMoreThreadFinished, state.thread, state.threadLoadingMore]);
  var closeThread = useCallback(function (e) {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    dispatch({
      type: 'closeThread'
    });
  }, []);
  var onMentionsHoverOrClick = useMentionsHandlers(props.onMentionsHover, props.onMentionsClick);
  var editMessage = useEditMessageHandler(props.doUpdateMessageRequest);

  var channelContextValue = _objectSpread$7(_objectSpread$7({}, state), {}, {
    watcher_count: state.watcherCount,
    // props
    acceptedFiles: props.acceptedFiles,
    Attachment: Attachment$1,
    channel,
    maxNumberOfFiles: props.maxNumberOfFiles,
    Message,
    multipleUploads: props.multipleUploads,
    mutes,
    // handlers
    closeThread,
    editMessage,
    loadMore,
    loadMoreThread,
    onMentionsClick: onMentionsHoverOrClick,
    onMentionsHover: onMentionsHoverOrClick,
    onUserClick: props.onUserClick,
    onUserHover: props.onUserHover,
    openThread,
    removeMessage,
    retrySendMessage,
    sendMessage,
    updateMessage,
    // from chatContext, for legacy reasons
    client,
    // emoji config and customization object, potentially find a better home
    emojiConfig,
    dispatch
  });

  var core;

  if (state.error) {
    core = /*#__PURE__*/React.createElement(LoadingErrorIndicator, {
      error: state.error
    });
  } else if (state.loading) {
    core = /*#__PURE__*/React.createElement(LoadingIndicator, {
      size: 25
    });
  } else if (!((_props$channel = props.channel) !== null && _props$channel !== void 0 && _props$channel.watch)) {
    core = /*#__PURE__*/React.createElement("div", null, t('Channel Missing'));
  } else {
    core = /*#__PURE__*/React.createElement(ChannelContext.Provider, {
      value: channelContextValue
    }, /*#__PURE__*/React.createElement("div", {
      className: "str-chat__container"
    }, props.children));
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "str-chat str-chat-channel ".concat(theme)
  }, core);
};

Channel.defaultProps = {
  multipleUploads: true
};
Channel.propTypes = {
  /** Which channel to connect to, will initialize the channel if it's not initialized yet */
  channel: PropTypes.instanceOf(Channel$2),

  /**
   * Empty channel UI component. This will be shown on the screen if there is no active channel.
   *
   * Defaults to null which skips rendering the Channel
   *
   * */
  EmptyPlaceholder: PropTypes.element,

  /**
   * Error indicator UI component. This will be shown on the screen if channel query fails.
   *
   * Defaults to and accepts same props as: [LoadingErrorIndicator](https://getstream.github.io/stream-chat-react/#loadingerrorindicator)
   *
   * */
  // @ts-expect-error elementType
  LoadingErrorIndicator: PropTypes.elementType,

  /**
   * Loading indicator UI component. This will be shown on the screen until the messages are
   * being queried from channel. Once the messages are loaded, loading indicator is removed from the screen
   * and replaced with children of the Channel component.
   *
   * Defaults to and accepts same props as: [LoadingIndicator](https://github.com/GetStream/stream-chat-react/blob/master/src/components/LoadingIndicator.js)
   */
  // @ts-expect-error elementType
  LoadingIndicator: PropTypes.elementType,

  /**
   * Message UI component to display a message in message list.
   *
   * Available built-in components (also accepts the same props as):
   *
   * 1. [MessageSimple](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageSimple.js) (default)
   * 2. [MessageTeam](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageTeam.js)
   * 3. [MessageLivestream](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageLivestream.js)
   * 3. [MessageCommerce](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageCommerce.js)
   *
   * */
  // @ts-expect-error elementType
  Message: PropTypes.elementType,

  /**
   * Attachment UI component to display attachment in individual message.
   *
   * Defaults to and accepts same props as: [Attachment](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment.js)
   * */
  // @ts-expect-error elementType
  Attachment: PropTypes.elementType,

  /**
   * Handle for click on @mention in message
   *
   * @param {Event} event DOM Click event
   * @param {User} user   Target [user object](https://getstream.io/chat/docs/#chat-doc-set-user) which is clicked
   */
  onMentionsClick: PropTypes.func,

  /**
   * Handle for hover on @mention in message
   *
   * @param {Event} event DOM hover event
   * @param {User} user   Target [user object](https://getstream.io/chat/docs/#chat-doc-set-user) which is hovered
   */
  onMentionsHover: PropTypes.func,

  /**
   * Callback invoked when the user clicks on an avatar
   *
   * @param {Event} event DOM click event
   * @param {User} user   Target [user object](https://getstream.io/chat/docs/#chat-doc-set-user) which is clicked
   */
  onUserClick: PropTypes.func,

  /**
   * Callback invoked when the user hovers over an avatar
   *
   * @param {Event} event DOM hover event
   * @param {User} user   Target [user object](https://getstream.io/chat/docs/#chat-doc-set-user) which is hovered
   */
  onUserHover: PropTypes.func,

  /** Whether to allow multiple attachment uploads */
  multipleUploads: PropTypes.bool,

  /** List of accepted file types */
  acceptedFiles: PropTypes.array,

  /** Maximum number of attachments allowed per message */
  maxNumberOfFiles: PropTypes.number,

  /** Override send message request (Advanced usage only)
   *
   * @param {String} channelId full channel ID in format of `type:id`
   * @param {Object} message
   */
  doSendMessageRequest: PropTypes.func,

  /**
   * Override mark channel read request (Advanced usage only)
   *
   * @param {Channel} channel object
   * */
  doMarkReadRequest: PropTypes.func,

  /** Override update(edit) message request (Advanced usage only)
   *
   * @param {String} channelId full channel ID in format of `type:id`
   * @param {Object} updatedMessage
   */
  doUpdateMessageRequest: PropTypes.func,

  /**
   * Optional component to override default NimbleEmoji from emoji-mart
   */
  // @ts-expect-error import type when converted to TS
  Emoji:
  /** @type {PropTypes.Validator<React.ElementType<NimbleEmojiProps>>} */
  PropTypes.elementType,

  /**
   * Optional prop to override default facebook.json emoji data set from emoji-mart
   */
  // @ts-expect-error import type when converted to TS
  emojiData:
  /** @type {PropTypes.Validator<EmojiMartData>} */
  PropTypes.object,

  /**
   * Optional component to override default NimbleEmojiIndex from emoji-mart
   */
  // @ts-expect-error import type when converted to TS
  EmojiIndex:
  /** @type {PropTypes.Validator<NimbleEmojiIndex>} */
  PropTypes.object,

  /**
   * Optional component to override default NimblePicker from emoji-mart
   */
  // @ts-expect-error import type when converted to TS
  EmojiPicker:
  /** @type {PropTypes.Validator<React.ElementType<NimblePickerProps>>} */
  PropTypes.elementType
};
var Channel$1 = /*#__PURE__*/React.memo(Channel);

/**
 * ChannelHeader - Render some basic information about this channel
 * @example ../../docs/ChannelHeader.md
 * @type {React.FC<import('../types').ChannelHeaderProps>}
 */

var ChannelHeader = function ChannelHeader(props) {
  var _props$Avatar = props.Avatar,
      Avatar$1 = _props$Avatar === void 0 ? Avatar : _props$Avatar,
      propImage = props.image,
      live = props.live,
      title = props.title;

  var _useContext = useContext(ChannelContext),
      channel = _useContext.channel,
      watcher_count = _useContext.watcher_count;

  var _useContext2 = useContext(ChatContext),
      openMobileNav = _useContext2.openMobileNav;

  var _useContext3 = useContext(TranslationContext),
      t = _useContext3.t;

  var _ref = (channel === null || channel === void 0 ? void 0 : channel.data) || {},
      channelImage = _ref.image,
      member_count = _ref.member_count,
      name = _ref.name,
      subtitle = _ref.subtitle;

  var image = propImage || channelImage;
  return /*#__PURE__*/React.createElement("div", {
    className: "str-chat__header-livestream"
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__header-hamburger",
    onClick: openMobileNav
  }, /*#__PURE__*/React.createElement("span", {
    className: "str-chat__header-hamburger--line"
  }), /*#__PURE__*/React.createElement("span", {
    className: "str-chat__header-hamburger--line"
  }), /*#__PURE__*/React.createElement("span", {
    className: "str-chat__header-hamburger--line"
  })), image && /*#__PURE__*/React.createElement(Avatar$1, {
    image: image,
    shape: "rounded",
    size: (channel === null || channel === void 0 ? void 0 : channel.type) === 'commerce' ? 60 : 40
  }), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__header-livestream-left"
  }, /*#__PURE__*/React.createElement("p", {
    className: "str-chat__header-livestream-left--title"
  }, title || name, ' ', live && /*#__PURE__*/React.createElement("span", {
    className: "str-chat__header-livestream-left--livelabel"
  }, t('live'))), subtitle && /*#__PURE__*/React.createElement("p", {
    className: "str-chat__header-livestream-left--subtitle"
  }, subtitle), /*#__PURE__*/React.createElement("p", {
    className: "str-chat__header-livestream-left--members"
  }, !live && !!member_count && member_count > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, t('{{ memberCount }} members', {
    memberCount: member_count
  }), ",", ' '), t('{{ watcherCount }} online', {
    watcherCount: watcher_count
  }))));
};

ChannelHeader.propTypes = {
  /**
   * Custom UI component to display user avatar
   *
   * Defaults to and accepts same props as: [Avatar](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Avatar/Avatar.js)
   * */
  Avatar:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').AvatarProps>>} */
  PropTypes.elementType,

  /** Manually set the image to render, defaults to the channel image */
  image: PropTypes.string,

  /** Show a little indicator that the channel is live right now */
  live: PropTypes.bool,

  /** Set title manually */
  title: PropTypes.string
};
var ChannelHeader$1 = /*#__PURE__*/React.memo(ChannelHeader);

var placeholder = "data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%3Csvg%20width%3D%2278px%22%20height%3D%2278px%22%20viewBox%3D%220%200%2078%2078%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%20%20%20%20%20%20%20%20%3Ctitle%3ECombined%20Shape%3C%2Ftitle%3E%20%20%20%20%3Cdesc%3ECreated%20with%20Sketch.%3C%2Fdesc%3E%20%20%20%20%3Cg%20id%3D%22Interactions%22%20stroke%3D%22none%22%20stroke-width%3D%221%22%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%20%20%20%20%20%20%20%20%3Cg%20id%3D%22Connection-Error-_-Connectivity%22%20transform%3D%22translate%28-270.000000%2C%20-30.000000%29%22%20fill%3D%22%23CF1F25%22%3E%20%20%20%20%20%20%20%20%20%20%20%20%3Cg%20id%3D%22109-network-connection%22%20transform%3D%22translate%28270.000000%2C%2030.000000%29%22%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M66.4609744%2C11.414231%20C81.6225232%2C26.5757798%2081.6225232%2C51.157545%2066.4609744%2C66.3188467%20C51.2994256%2C81.4803954%2026.7176604%2C81.4803954%2011.5563587%2C66.3188467%20C-3.60519004%2C51.1572979%20-3.60519004%2C26.5755327%2011.5563587%2C11.414231%20C26.7179075%2C-3.74731776%2051.2996727%2C-3.74731776%2066.4609744%2C11.414231%20Z%20M54.7853215%2C45.8823776%20L54.7853215%2C40.5882574%20C54.7853215%2C39.613638%2053.9952341%2C38.8235506%2053.0206147%2C38.8235506%20L44.9576695%2C38.8235506%20L41.428256%2C42.3529641%20L51.255555%2C42.3529641%20L51.255555%2C45.8823776%20L54.7853215%2C45.8823776%20Z%20M40.6659027%2C43.1153174%20L37.8988425%2C45.8823776%20L40.6659027%2C45.8823776%20L40.6659027%2C43.1153174%20Z%20M51.1764962%2C56.4702653%20L58.2353232%2C56.4702653%20C59.2099355%2C56.4702653%2060.00003%2C55.6801708%2060.00003%2C54.7055585%20L60.00003%2C51.176145%20C60.00003%2C50.2015327%2059.2099355%2C49.4114382%2058.2353232%2C49.4114382%20L51.1764962%2C49.4114382%20C50.2018839%2C49.4114382%2049.4117894%2C50.2015327%2049.4117894%2C51.176145%20L49.4117894%2C54.7055585%20C49.4117894%2C55.6801708%2050.2018839%2C56.4702653%2051.1764962%2C56.4702653%20Z%20M35.2941353%2C56.4702653%20L42.3529624%2C56.4702653%20C43.3275746%2C56.4702653%2044.1176691%2C55.6801708%2044.1176691%2C54.7055585%20L44.1176691%2C51.176145%20C44.1176691%2C50.2015327%2043.3275746%2C49.4114382%2042.3529624%2C49.4114382%20L35.2941353%2C49.4114382%20C34.319523%2C49.4114382%2033.5294285%2C50.2015327%2033.5294285%2C51.176145%20L33.5294285%2C54.7055585%20C33.5294285%2C55.6801708%2034.319523%2C56.4702653%2035.2941353%2C56.4702653%20Z%20M56.6964989%2C19.0874231%20C56.007381%2C18.3985134%2054.8903216%2C18.3985134%2054.2012036%2C19.087423%20L45.882376%2C27.4062507%20L45.882376%2C19.4117761%20C45.882376%2C18.4371568%2045.0922885%2C17.6470693%2044.1176692%2C17.6470693%20L33.5294286%2C17.6470693%20C32.5548092%2C17.6470694%2031.7647218%2C18.4371568%2031.7647218%2C19.4117761%20L31.7647218%2C30.0000167%20C31.7647219%2C30.9746363%2032.5548092%2C31.7647237%2033.5294285%2C31.7647237%20L41.5239031%2C31.7647237%20L34.4650761%2C38.8235508%20L24.7058947%2C38.8235508%20C23.7312753%2C38.8235508%2022.9411879%2C39.6136382%2022.9411879%2C40.5882575%20L22.9411879%2C45.8823778%20L26.4706014%2C45.8823778%20L26.4706014%2C42.3529643%20L30.9356624%2C42.3529643%20L23.8768354%2C49.4117914%20L19.4117743%2C49.4117914%20C18.4371549%2C49.4117914%2017.6470675%2C50.2018788%2017.6470675%2C51.1764981%20L17.6470675%2C54.7059117%20C17.6504049%2C54.9674302%2017.7129076%2C55.2248042%2017.8298886%2C55.4587302%20L16.4456526%2C56.8429662%20C15.7446193%2C57.5200453%2015.7252005%2C58.6372282%2016.4022825%2C59.3382615%20C17.0793616%2C60.0392948%2018.1965445%2C60.0587136%2018.8975778%2C59.3816316%20C18.9122847%2C59.3674273%2018.9267436%2C59.3529684%2018.940948%2C59.3382615%20L56.6964963%2C21.5830662%20C57.3856425%2C20.8939094%2057.3856425%2C19.7765747%2056.6964963%2C19.0874179%20Z%22%20id%3D%22Combined-Shape%22%3E%3C%2Fpath%3E%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fg%3E%20%20%20%20%20%20%20%20%3C%2Fg%3E%20%20%20%20%3C%2Fg%3E%3C%2Fsvg%3E";

// @ts-check
/**
 * ChatDown - Indicator that chat is down or your network isn't working
 * @example ../../docs/ChatDown.md
 * @typedef {import('../types').ChatDownProps} Props
 * @type {React.FC<Props>}
 */

var ChatDown = function ChatDown(_ref) {
  var image = _ref.image,
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'Error' : _ref$type,
      text = _ref.text;

  var _useContext = useContext(TranslationContext),
      t = _useContext.t;

  return /*#__PURE__*/React.createElement("div", {
    className: "str-chat__down"
  }, /*#__PURE__*/React.createElement(LoadingChannels$1, null), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__down-main"
  }, /*#__PURE__*/React.createElement("img", {
    "data-testid": "chatdown-img",
    src: image || placeholder
  }), /*#__PURE__*/React.createElement("h1", null, type), /*#__PURE__*/React.createElement("h3", null, text || t('Error connecting to chat, refresh the page to try again.'))));
};

ChatDown.propTypes = {
  /** The image url for this error */
  image: PropTypes.string,

  /** The type of error */
  type: PropTypes.string.isRequired,

  /** The error message to show */
  text: PropTypes.string
};
var ChatDown$1 = /*#__PURE__*/React.memo(ChatDown);

var chevrondown = "data:image/svg+xml,%3Csvg%20width%3D%228%22%20height%3D%225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%3Cdefs%3E%3Cpath%20id%3D%22b%22%20d%3D%22M.667.667L4%204%207.333.667z%22%2F%3E%3Cfilter%20x%3D%22-7.5%25%22%20y%3D%22-15%25%22%20width%3D%22115%25%22%20height%3D%22160%25%22%20filterUnits%3D%22objectBoundingBox%22%20id%3D%22a%22%3E%3CfeOffset%20dy%3D%221%22%20in%3D%22SourceAlpha%22%20result%3D%22shadowOffsetOuter1%22%2F%3E%3CfeComposite%20in%3D%22shadowOffsetOuter1%22%20in2%3D%22SourceAlpha%22%20operator%3D%22out%22%20result%3D%22shadowOffsetOuter1%22%2F%3E%3CfeColorMatrix%20values%3D%220%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200.685858243%200%22%20in%3D%22shadowOffsetOuter1%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cuse%20fill%3D%22%23000%22%20filter%3D%22url%28%23a%29%22%20xlink%3Ahref%3D%22%23b%22%2F%3E%3Cuse%20fill-opacity%3D%22.7%22%20fill%3D%22%23FFF%22%20xlink%3Ahref%3D%22%23b%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E";

// @ts-check
/**
 * ChannelList - A preview list of channels, allowing you to select the channel you want to open
 * @example ../../docs/ChannelList.md
 * @type React.FC<import('../types').ChannelListUIComponentProps>
 */

var ChannelListTeam = function ChannelListTeam(_ref) {
  var _ref$error = _ref.error,
      error = _ref$error === void 0 ? false : _ref$error,
      loading = _ref.loading,
      sidebarImage = _ref.sidebarImage,
      showSidebar = _ref.showSidebar,
      _ref$Avatar = _ref.Avatar,
      Avatar$1 = _ref$Avatar === void 0 ? Avatar : _ref$Avatar,
      _ref$LoadingErrorIndi = _ref.LoadingErrorIndicator,
      LoadingErrorIndicator = _ref$LoadingErrorIndi === void 0 ? ChatDown$1 : _ref$LoadingErrorIndi,
      _ref$LoadingIndicator = _ref.LoadingIndicator,
      LoadingIndicator = _ref$LoadingIndicator === void 0 ? LoadingChannels$1 : _ref$LoadingIndicator,
      children = _ref.children;

  var _useContext = useContext(ChatContext),
      client = _useContext.client;

  var _ref2 = client.user || {},
      id = _ref2.id,
      image = _ref2.image,
      name = _ref2.name,
      status = _ref2.status;

  if (error) {
    return /*#__PURE__*/React.createElement(LoadingErrorIndicator, {
      type: "Connection Error"
    });
  }

  if (loading) {
    return /*#__PURE__*/React.createElement(LoadingIndicator, null);
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "str-chat__channel-list-team"
  }, showSidebar && /*#__PURE__*/React.createElement("div", {
    className: "str-chat__channel-list-team__sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__channel-list-team__sidebar--top"
  }, /*#__PURE__*/React.createElement(Avatar$1, {
    image: sidebarImage,
    size: 50
  }))), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__channel-list-team__main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__channel-list-team__header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__channel-list-team__header--left"
  }, /*#__PURE__*/React.createElement(Avatar$1, {
    image: image,
    name: name || id,
    size: 40
  })), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__channel-list-team__header--middle"
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__channel-list-team__header--title"
  }, name || id), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__channel-list-team__header--status ".concat(status)
  }, status)), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__channel-list-team__header--right"
  }, /*#__PURE__*/React.createElement("button", {
    className: "str-chat__channel-list-team__header--button"
  }, /*#__PURE__*/React.createElement("img", {
    src: chevrondown
  })))), children));
};

ChannelListTeam.propTypes = {
  /** When true, loading indicator is shown - [LoadingChannels](https://github.com/GetStream/stream-chat-react/blob/master/src/components/LoadingChannels.js) */
  loading: PropTypes.bool,

  /** When true, error indicator is shown - [ChatDown](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChatDown.js) */
  error: PropTypes.bool,

  /** When true, sidebar containing logo of the team is visible */
  showSidebar: PropTypes.bool,

  /** Url for sidebar logo image. */
  sidebarImage: PropTypes.string,

  /**
   * Custom UI component to display user avatar
   *
   * Defaults to and accepts same props as: [Avatar](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Avatar/Avatar.js)
   * */
  Avatar:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').AvatarProps>>} */
  PropTypes.elementType,

  /**
   * Loading indicator UI Component. It will be displayed if `loading` prop is true.
   *
   * Defaults to and accepts same props as:
   * [LoadingChannels](https://github.com/GetStream/stream-chat-react/blob/master/src/components/LoadingChannels.js)
   *
   */
  LoadingIndicator:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').LoadingIndicatorProps>>} */
  PropTypes.elementType,

  /**
   * Error indicator UI Component. It will be displayed if `error` prop is true
   *
   * Defaults to and accepts same props as:
   * [ChatDown](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChatDown.js)
   *
   */
  LoadingErrorIndicator:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').ChatDownProps>>} */
  PropTypes.elementType
};

// @ts-check
/**
 * @type {React.FC<import('../types').LoadMoreButtonProps>}
 */

var LoadMoreButton = function LoadMoreButton(_ref) {
  var onClick = _ref.onClick,
      refreshing = _ref.refreshing,
      _ref$children = _ref.children,
      children = _ref$children === void 0 ? 'Load more' : _ref$children;
  return /*#__PURE__*/React.createElement("div", {
    className: "str-chat__load-more-button"
  }, /*#__PURE__*/React.createElement("button", {
    className: "str-chat__load-more-button__button",
    onClick: onClick,
    "data-testid": "load-more-button",
    disabled: refreshing
  }, refreshing ? /*#__PURE__*/React.createElement(LoadingIndicator$1, null) : children));
};

LoadMoreButton.propTypes = {
  /** onClick handler load more button. Pagination logic should be executed in this handler. */
  onClick: PropTypes.func.isRequired,

  /** If true, LoadingIndicator is displayed instead of button */
  refreshing: PropTypes.bool.isRequired
};
var DefaultLoadMoreButton = /*#__PURE__*/React.memo(LoadMoreButton);

var LoadMorePaginator = function LoadMorePaginator(_ref) {
  var reverse = _ref.reverse,
      hasNextPage = _ref.hasNextPage,
      refreshing = _ref.refreshing,
      loadNextPage = _ref.loadNextPage,
      LoadMoreButton = _ref.LoadMoreButton,
      children = _ref.children;
  return /*#__PURE__*/React.createElement(React.Fragment, null, !reverse && children, hasNextPage && smartRender(LoadMoreButton, {
    refreshing,
    onClick: loadNextPage
  }), reverse && children);
};

LoadMorePaginator.defaultProps = {
  LoadMoreButton: DefaultLoadMoreButton
};
LoadMorePaginator.propTypes = {
  LoadMoreButton: PropTypes.oneOfType([PropTypes.node, PropTypes.func, PropTypes.object]),

  /** callback to load the next page */
  loadNextPage: PropTypes.func,

  /** indicates if there is a next page to load */
  hasNextPage: PropTypes.bool,

  /** display the items in opposite order */
  reverse: PropTypes.bool
};
var LoadMorePaginator$1 = /*#__PURE__*/React.memo(LoadMorePaginator);

// @ts-check
/**
 * @type {React.FC<import('../types').EmptyStateIndicatorProps>} param0
 */

var EmptyStateIndicator = function EmptyStateIndicator(_ref) {
  var listType = _ref.listType;

  var _useContext = useContext(TranslationContext),
      t = _useContext.t;

  if (listType === 'channel') return /*#__PURE__*/React.createElement("p", null, t('You have no channels currently'));
  if (listType === 'message') return null;
  return /*#__PURE__*/React.createElement("p", null, "No items exist");
};

EmptyStateIndicator.propTypes = {
  /** channel | message */
  listType: PropTypes.string.isRequired
};
var DefaultEmptyStateIndicator = /*#__PURE__*/React.memo(EmptyStateIndicator);

// @ts-check

/**
 * @param {string | undefined} cid
 * @param {import('stream-chat').Channel[]} channels
 */
var moveChannelUp = function moveChannelUp(cid, channels) {
  // get channel index
  var channelIndex = channels.findIndex(function (channel) {
    return channel.cid === cid;
  });
  if (channelIndex <= 0) return channels; // get channel from channels

  var channel = channels[channelIndex]; // remove channel from current position

  channels.splice(channelIndex, 1); // add channel at the start

  channels.unshift(channel);
  return _toConsumableArray(channels);
};
/**
 * @param {import('../types').StreamChatReactClient} client
 * @param {string} type
 * @param {string} id
 */

var getChannel = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(client, type, id) {
    var channel;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            channel = client.channel(type, id);
            _context.next = 3;
            return channel.watch();

          case 3:
            return _context.abrupt("return", channel);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getChannel(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var MAX_QUERY_CHANNELS_LIMIT = 30;

/**
 * @typedef {React.Dispatch<React.SetStateAction<import('stream-chat').Channel[]>>} SetChannels
 * @param {SetChannels} setChannels
 * @param {boolean} [lockChannelOrder]
 */

var useMessageNewListener = function useMessageNewListener(setChannels) {
  var lockChannelOrder = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var allowNewMessagesFromUnfilteredChannels = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var _useContext = useContext(ChatContext),
      client = _useContext.client;

  useEffect(function () {
    /** @param {import('stream-chat').Event} event */
    var handleEvent = function handleEvent(event) {
      setChannels(function (channels) {
        var channelInList = channels.filter(function (channel) {
          return channel.cid === event.cid;
        }).length > 0;

        if (!channelInList && allowNewMessagesFromUnfilteredChannels && event.channel_type) {
          var channel = client.channel(event.channel_type, event.channel_id);
          return uniqBy([channel].concat(_toConsumableArray(channels)), 'cid');
        }

        if (!lockChannelOrder) return moveChannelUp(event.cid, channels);
        return channels;
      });
    };

    client.on('message.new', handleEvent);
    return function () {
      client.off('message.new', handleEvent);
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lockChannelOrder]);
};

/**
 * @typedef {import('stream-chat').Event} NotificationAddedToChannelEvent
 * @typedef {React.Dispatch<React.SetStateAction<import('stream-chat').Channel[]>>} SetChannels
 * @param {SetChannels} setChannels
 * @param {(setChannels: SetChannels, event: NotificationAddedToChannelEvent) => void} [customHandler]
 */

var useNotificationMessageNewListener = function useNotificationMessageNewListener(setChannels, customHandler) {
  var _useContext = useContext(ChatContext),
      client = _useContext.client;

  useEffect(function () {
    /** @param {import('stream-chat').Event} e */
    var handleEvent = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(e) {
        var _e$channel;

        var channel;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(customHandler && typeof customHandler === 'function')) {
                  _context.next = 4;
                  break;
                }

                customHandler(setChannels, e);
                _context.next = 9;
                break;

              case 4:
                if (!((_e$channel = e.channel) !== null && _e$channel !== void 0 && _e$channel.type)) {
                  _context.next = 9;
                  break;
                }

                _context.next = 7;
                return getChannel(client, e.channel.type, e.channel.id);

              case 7:
                channel = _context.sent;
                // move channel to starting position
                setChannels(function (channels) {
                  return uniqBy([channel].concat(_toConsumableArray(channels)), 'cid');
                });

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function handleEvent(_x) {
        return _ref.apply(this, arguments);
      };
    }();

    client.on('notification.message_new', handleEvent);
    return function () {
      client.off('notification.message_new', handleEvent);
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customHandler]);
};

/**
 * @typedef {import('stream-chat').Event} NotificationAddedToChannelEvent
 * @typedef {React.Dispatch<React.SetStateAction<import('stream-chat').Channel[]>>} SetChannels
 * @param {SetChannels} setChannels
 * @param {(setChannels: SetChannels, event: NotificationAddedToChannelEvent) => void} [customHandler]
 */

var useNotificationAddedToChannelListener = function useNotificationAddedToChannelListener(setChannels, customHandler) {
  var _useContext = useContext(ChatContext),
      client = _useContext.client;

  useEffect(function () {
    /** @param {import('stream-chat').Event} e */
    var handleEvent = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(e) {
        var _e$channel;

        var channel;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(customHandler && typeof customHandler === 'function')) {
                  _context.next = 4;
                  break;
                }

                customHandler(setChannels, e);
                _context.next = 9;
                break;

              case 4:
                if (!((_e$channel = e.channel) !== null && _e$channel !== void 0 && _e$channel.type)) {
                  _context.next = 9;
                  break;
                }

                _context.next = 7;
                return getChannel(client, e.channel.type, e.channel.id);

              case 7:
                channel = _context.sent;
                setChannels(function (channels) {
                  return uniqBy([channel].concat(_toConsumableArray(channels)), 'cid');
                });

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function handleEvent(_x) {
        return _ref.apply(this, arguments);
      };
    }();

    client.on('notification.added_to_channel', handleEvent);
    return function () {
      client.off('notification.added_to_channel', handleEvent);
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customHandler]);
};

// @ts-check
/**
 * @typedef {import('stream-chat').Event} NotificationAddedToChannelEvent
 * @typedef {React.Dispatch<React.SetStateAction<import('stream-chat').Channel[]>>} SetChannels
 * @param {SetChannels} setChannels
 * @param {(setChannels: SetChannels, event: NotificationAddedToChannelEvent) => void} [customHandler]
 */

var useNotificationRemovedFromChannelListener = function useNotificationRemovedFromChannelListener(setChannels, customHandler) {
  var _useContext = useContext(ChatContext),
      client = _useContext.client;

  useEffect(function () {
    /** @param {import('stream-chat').Event} e */
    var handleEvent = function handleEvent(e) {
      if (customHandler && typeof customHandler === 'function') {
        customHandler(setChannels, e);
      } else {
        setChannels(function (channels) {
          return channels.filter(function (channel) {
            var _e$channel;

            return channel.cid !== ((_e$channel = e.channel) === null || _e$channel === void 0 ? void 0 : _e$channel.cid);
          });
        });
      }
    };

    client.on('notification.removed_from_channel', handleEvent);
    return function () {
      client.off('notification.removed_from_channel', handleEvent);
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customHandler]);
};

/**
 * @typedef {import('stream-chat').Event} ChannelDeletedEvent
 * @typedef {React.Dispatch<React.SetStateAction<import('stream-chat').Channel[]>>} SetChannels
 * @param {SetChannels} setChannels
 * @param {(setChannels: SetChannels, event: ChannelDeletedEvent) => void} [customHandler]
 */

var useChannelDeletedListener = function useChannelDeletedListener(setChannels, customHandler) {
  var _useContext = useContext(ChatContext),
      client = _useContext.client;

  useEffect(function () {
    /** @param {import('stream-chat').Event} e */
    var handleEvent = function handleEvent(e) {
      if (customHandler && typeof customHandler === 'function') {
        customHandler(setChannels, e);
      } else {
        setChannels(function (channels) {
          var channelIndex = channels.findIndex(function (channel) {
            return channel.cid === (e === null || e === void 0 ? void 0 : e.cid);
          });
          if (channelIndex < 0) return _toConsumableArray(channels); // Remove the deleted channel from the list.s

          channels.splice(channelIndex, 1); // eslint-disable-next-line consistent-return

          return _toConsumableArray(channels);
        });
      }
    };

    client.on('channel.deleted', handleEvent);
    return function () {
      client.off('channel.deleted', handleEvent);
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customHandler]);
};

/**
 * @typedef {import('stream-chat').Event} ChannelTruncatedEvent
 * @typedef {React.Dispatch<React.SetStateAction<import('stream-chat').Channel[]>>} SetChannels
 * @param {SetChannels} setChannels
 * @param {(setChannels: SetChannels, event: ChannelTruncatedEvent) => void} [customHandler]
 * @param {() => void} [forceUpdate]
 */

var useChannelTruncatedListener = function useChannelTruncatedListener(setChannels, customHandler, forceUpdate) {
  var _useContext = useContext(ChatContext),
      client = _useContext.client;

  useEffect(function () {
    /** @param {import('stream-chat').Event} e */
    var handleEvent = function handleEvent(e) {
      setChannels(function (channels) {
        return _toConsumableArray(channels);
      });

      if (customHandler && typeof customHandler === 'function') {
        customHandler(setChannels, e);
      }

      if (forceUpdate) {
        forceUpdate();
      }
    };

    client.on('channel.truncated', handleEvent);
    return function () {
      client.off('channel.truncated', handleEvent);
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customHandler]);
};

/**
 * @typedef {import('stream-chat').Event} ChannelUpdatedEvent
 * @typedef {React.Dispatch<React.SetStateAction<import('stream-chat').Channel[]>>} SetChannels
 * @param {SetChannels} setChannels
 * @param {(setChannels: SetChannels, event: ChannelUpdatedEvent) => void} [customHandler]
 * @param {() => void} [forceUpdate]
 */

var useChannelUpdatedListener = function useChannelUpdatedListener(setChannels, customHandler, forceUpdate) {
  var _useContext = useContext(ChatContext),
      client = _useContext.client;

  useEffect(function () {
    /** @param {import('stream-chat').Event} e */
    var handleEvent = function handleEvent(e) {
      setChannels(function (channels) {
        var channelIndex = channels.findIndex(function (channel) {
          var _e$channel;

          return channel.cid === ((_e$channel = e.channel) === null || _e$channel === void 0 ? void 0 : _e$channel.cid);
        });

        if (channelIndex > -1 && e.channel) {
          var newChannels = channels;
          newChannels[channelIndex].data = e.channel;
          return _toConsumableArray(newChannels);
        }

        return channels;
      });

      if (forceUpdate) {
        forceUpdate();
      }

      if (customHandler && typeof customHandler === 'function') {
        customHandler(setChannels, e);
      }
    };

    client.on('channel.updated', handleEvent);
    return function () {
      client.off('channel.updated', handleEvent);
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customHandler]);
};

/**
 * @typedef {import('stream-chat').Event} ChannelHiddenEvent
 * @typedef {React.Dispatch<React.SetStateAction<import('stream-chat').Channel[]>>} SetChannels
 * @param {SetChannels} setChannels
 * @param {(setChannels: SetChannels, event: ChannelHiddenEvent) => void} [customHandler]
 */

var useChannelHiddenListener = function useChannelHiddenListener(setChannels, customHandler) {
  var _useContext = useContext(ChatContext),
      client = _useContext.client;

  useEffect(function () {
    /** @param {import('stream-chat').Event} e */
    var handleEvent = function handleEvent(e) {
      if (customHandler && typeof customHandler === 'function') {
        customHandler(setChannels, e);
      } else {
        setChannels(function (channels) {
          var channelIndex = channels.findIndex(function (channel) {
            return channel.cid === (e === null || e === void 0 ? void 0 : e.cid);
          });
          if (channelIndex < 0) return _toConsumableArray(channels); // Remove the hidden channel from the list.s

          channels.splice(channelIndex, 1); // eslint-disable-next-line consistent-return

          return _toConsumableArray(channels);
        });
      }
    };

    client.on('channel.hidden', handleEvent);
    return function () {
      client.off('channel.hidden', handleEvent);
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customHandler]);
};

/**
 * @typedef {import('stream-chat').Event} ChannelVisibleEvent
 * @typedef {React.Dispatch<React.SetStateAction<import('stream-chat').Channel[]>>} SetChannels
 * @param {SetChannels} setChannels
 * @param {(setChannels: SetChannels, event: ChannelVisibleEvent) => void} [customHandler]
 */

var useChannelVisibleListener = function useChannelVisibleListener(setChannels, customHandler) {
  var _useContext = useContext(ChatContext),
      client = _useContext.client;

  useEffect(function () {
    /** @param {import('stream-chat').Event} e */
    var handleEvent = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(e) {
        var channel;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(customHandler && typeof customHandler === 'function')) {
                  _context.next = 4;
                  break;
                }

                customHandler(setChannels, e);
                _context.next = 9;
                break;

              case 4:
                if (!(e !== null && e !== void 0 && e.type && e.channel_type && e.channel_id)) {
                  _context.next = 9;
                  break;
                }

                _context.next = 7;
                return getChannel(client, e.channel_type, e.channel_id);

              case 7:
                channel = _context.sent;
                setChannels(function (channels) {
                  return uniqBy([channel].concat(_toConsumableArray(channels)), 'cid');
                });

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function handleEvent(_x) {
        return _ref.apply(this, arguments);
      };
    }();

    client.on('channel.visible', handleEvent);
    return function () {
      client.off('channel.visible', handleEvent);
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customHandler]);
};

// @ts-check
/**
 * @param {() => void} [forceUpdate]
 */

var useConnectionRecoveredListener = function useConnectionRecoveredListener(forceUpdate) {
  var _useContext = useContext(ChatContext),
      client = _useContext.client;

  useEffect(function () {
    var handleEvent = function handleEvent() {
      if (forceUpdate) {
        forceUpdate();
      }
    };

    client.on('connection.recovered', handleEvent);
    return function () {
      client.off('connection.recovered', handleEvent);
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

/**
 * @typedef {React.Dispatch<React.SetStateAction<import('stream-chat').Channel[]>>} SetChannels
 * @param {SetChannels} setChannels
 */

var useUserPresenceChangedListener = function useUserPresenceChangedListener(setChannels) {
  var _useContext = useContext(ChatContext),
      client = _useContext.client;

  useEffect(function () {
    /** @param {import('stream-chat').Event} event */
    var handleEvent = function handleEvent(event) {
      setChannels(function (channels) {
        var newChannels = channels.map(function (channel) {
          var _event$user;

          if (!((_event$user = event.user) !== null && _event$user !== void 0 && _event$user.id) || !channel.state.members[event.user.id]) return channel;
          var newChannel = channel; // dumb workaround for linter

          newChannel.state.members[event.user.id].user = event.user;
          return newChannel;
        });
        return _toConsumableArray(newChannels);
      });
    };

    client.on('user.presence.changed', handleEvent);
    return function () {
      client.off('user.presence.changed', handleEvent);
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

function ownKeys$8(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$8(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$8(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$8(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
/**
 * @typedef {import('stream-chat').Channel} Channel
 * @param {import('../types').StreamChatReactClient} client
 * @param {import('stream-chat').ChannelFilters} filters
 * @param {import('stream-chat').ChannelSort} [sort]
 * @param {import('stream-chat').ChannelOptions} [options]
 * @param {(channels: Channel[], setChannels: React.Dispatch<React.SetStateAction<Channel[]>>) => void} [activeChannelHandler]
 */

var usePaginatedChannels = function usePaginatedChannels(client, filters, sort, options, activeChannelHandler) {
  var _useState = useState(
  /** @type {Channel[]} */
  []),
      _useState2 = _slicedToArray(_useState, 2),
      channels = _useState2[0],
      setChannels = _useState2[1];

  var _useState3 = useState(true),
      _useState4 = _slicedToArray(_useState3, 2),
      loadingChannels = _useState4[0],
      setLoadingChannels = _useState4[1];

  var _useState5 = useState(true),
      _useState6 = _slicedToArray(_useState5, 2),
      refreshing = _useState6[0],
      setRefreshing = _useState6[1];

  var _useState7 = useState(0),
      _useState8 = _slicedToArray(_useState7, 2),
      offset = _useState8[0],
      setOffset = _useState8[1];

  var _useState9 = useState(false),
      _useState10 = _slicedToArray(_useState9, 2),
      error = _useState10[0],
      setError = _useState10[1];

  var _useState11 = useState(true),
      _useState12 = _slicedToArray(_useState11, 2),
      hasNextPage = _useState12[0],
      setHasNextPage = _useState12[1];

  var filterString = useMemo(function () {
    return JSON.stringify(filters);
  }, [filters]);
  /**
   * @param {string} [queryType]
   */

  var queryChannels = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(queryType) {
      var _options$limit;

      var newOptions, channelQueryResponse, newChannels;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (queryType === 'reload') {
                setChannels([]);
                setLoadingChannels(true);
              }

              setRefreshing(true);
              newOptions = _objectSpread$8(_objectSpread$8({
                offset: queryType === 'reload' ? 0 : offset
              }, options), {}, {
                limit: (_options$limit = options === null || options === void 0 ? void 0 : options.limit) !== null && _options$limit !== void 0 ? _options$limit : MAX_QUERY_CHANNELS_LIMIT
              });
              _context.prev = 3;
              _context.next = 6;
              return client.queryChannels(filters, sort || {}, newOptions);

            case 6:
              channelQueryResponse = _context.sent;

              if (queryType === 'reload') {
                newChannels = channelQueryResponse;
              } else {
                newChannels = [].concat(_toConsumableArray(channels), _toConsumableArray(channelQueryResponse));
              }

              setChannels(newChannels);
              setHasNextPage(channelQueryResponse.length >= newOptions.limit); // Set active channel only after first page.

              if (offset === 0 && activeChannelHandler) {
                activeChannelHandler(newChannels, setChannels);
              }

              setOffset(newChannels.length);
              _context.next = 18;
              break;

            case 14:
              _context.prev = 14;
              _context.t0 = _context["catch"](3);
              console.warn(_context.t0);
              setError(true);

            case 18:
              setLoadingChannels(false);
              setRefreshing(false);

            case 20:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[3, 14]]);
    }));

    return function queryChannels(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  var loadNextPage = function loadNextPage() {
    queryChannels();
  };

  useEffect(function () {
    queryChannels('reload'); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterString]);
  return {
    channels,
    loadNextPage,
    hasNextPage,
    status: {
      loadingChannels,
      refreshing,
      error
    },
    setChannels
  };
};

// @ts-check
/**
 * @param {React.MutableRefObject<HTMLDivElement | null>} channelListRef
 * @param {boolean} navOpen
 * @param {() => void} [closeMobileNav]
 */

var useMobileNavigation = function useMobileNavigation(channelListRef, navOpen, closeMobileNav) {
  useEffect(function () {
    /** @param {MouseEvent} e */
    var handleClickOutside = function handleClickOutside(e) {
      if (closeMobileNav && channelListRef.current && !channelListRef.current.contains(
      /** @type {Node | null} */
      e.target) && navOpen) {
        closeMobileNav();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return function () {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [navOpen, channelListRef, closeMobileNav]);
};

function ownKeys$9(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$9(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$9(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$9(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var DEFAULT_FILTERS = {};
var DEFAULT_OPTIONS = {};
var DEFAULT_SORT = {};
/**
 * ChannelList - A preview list of channels, allowing you to select the channel you want to open
 * @example ../../docs/ChannelList.md
 * @type {React.FC<import('../types').ChannelListProps>}
 */

var ChannelList = function ChannelList(props) {
  var _useContext = useContext(ChatContext),
      client = _useContext.client,
      setActiveChannel = _useContext.setActiveChannel,
      _useContext$navOpen = _useContext.navOpen,
      navOpen = _useContext$navOpen === void 0 ? false : _useContext$navOpen,
      closeMobileNav = _useContext.closeMobileNav,
      channel = _useContext.channel,
      theme = _useContext.theme;

  var channelListRef = useRef(
  /** @type {HTMLDivElement | null} */
  null);

  var _useState = useState(0),
      _useState2 = _slicedToArray(_useState, 2),
      channelUpdateCount = _useState2[0],
      setChannelUpdateCount = _useState2[1];
  /**
   * Set a channel with id {customActiveChannel} as active and move it to the top of the list.
   * If customActiveChannel prop is absent, then set the first channel in list as active channel.
   * @param {import('stream-chat').Channel[]} channels
   * @param {React.Dispatch<React.SetStateAction<import('stream-chat').Channel[]>>} setChannels
   */


  var activeChannelHandler = function activeChannelHandler(channels, setChannels) {
    var _props$setActiveChann = props.setActiveChannelOnMount,
        setActiveChannelOnMount = _props$setActiveChann === void 0 ? true : _props$setActiveChann,
        customActiveChannel = props.customActiveChannel,
        watchers = props.watchers,
        _props$options = props.options,
        options = _props$options === void 0 ? {} : _props$options;

    if (!channels || channels.length === 0 || channels.length > (options.limit || MAX_QUERY_CHANNELS_LIMIT)) {
      return;
    }

    if (customActiveChannel) {
      var customActiveChannelObject = channels.find(function (chan) {
        return chan.id === customActiveChannel;
      });

      if (customActiveChannelObject) {
        if (setActiveChannel) {
          setActiveChannel(customActiveChannelObject, watchers);
        }

        var newChannels = moveChannelUp(customActiveChannelObject.cid, channels);
        setChannels(newChannels);
      }

      return;
    }

    if (setActiveChannelOnMount && setActiveChannel) {
      setActiveChannel(channels[0], watchers);
    }
  }; // When channel list (channels array) is updated without any shallow changes (or with only deep changes), then we want
  // to force the channel preview to re-render.
  // This happens in case of event channel.updated, channel.truncated etc. Inner properties of channel is updated but
  // react renderer will only make shallow comparison and choose to not to re-render the UI.
  // By updating the dummy prop - channelUpdateCount, we can force this re-render.


  var forceUpdate = function forceUpdate() {
    setChannelUpdateCount(function (count) {
      return count + 1;
    });
  };

  var _usePaginatedChannels = usePaginatedChannels(client, props.filters || DEFAULT_FILTERS, props.sort || DEFAULT_SORT, props.options || DEFAULT_OPTIONS, activeChannelHandler),
      channels = _usePaginatedChannels.channels,
      loadNextPage = _usePaginatedChannels.loadNextPage,
      hasNextPage = _usePaginatedChannels.hasNextPage,
      status = _usePaginatedChannels.status,
      setChannels = _usePaginatedChannels.setChannels;

  var loadedChannels = props.channelRenderFilterFn ? props.channelRenderFilterFn(channels) : channels;
  useMobileNavigation(channelListRef, navOpen, closeMobileNav); // All the event listeners

  useMessageNewListener(setChannels, props.lockChannelOrder, props.allowNewMessagesFromUnfilteredChannels);
  useNotificationMessageNewListener(setChannels, props.onMessageNew);
  useNotificationAddedToChannelListener(setChannels, props.onAddedToChannel);
  useNotificationRemovedFromChannelListener(setChannels, props.onRemovedFromChannel);
  useChannelDeletedListener(setChannels, props.onChannelDeleted);
  useChannelHiddenListener(setChannels, props.onChannelHidden);
  useChannelVisibleListener(setChannels, props.onChannelVisible);
  useChannelTruncatedListener(setChannels, props.onChannelTruncated, forceUpdate);
  useChannelUpdatedListener(setChannels, props.onChannelUpdated, forceUpdate);
  useConnectionRecoveredListener(forceUpdate);
  useUserPresenceChangedListener(setChannels); // If the active channel is deleted, then unset the active channel.

  useEffect(function () {
    /** @param {import('stream-chat').Event} e */
    var handleEvent = function handleEvent(e) {
      if (setActiveChannel && (e === null || e === void 0 ? void 0 : e.cid) === (channel === null || channel === void 0 ? void 0 : channel.cid)) {
        setActiveChannel();
      }
    };

    client.on('channel.deleted', handleEvent);
    client.on('channel.hidden', handleEvent);
    return function () {
      client.off('channel.deleted', handleEvent);
      client.off('channel.hidden', handleEvent);
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel]); // renders the channel preview or item

  /** @param {import('stream-chat').Channel} item */

  var renderChannel = function renderChannel(item) {
    if (!item) return null;
    var _props$Avatar = props.Avatar,
        Avatar$1 = _props$Avatar === void 0 ? Avatar : _props$Avatar,
        _props$Preview = props.Preview,
        Preview = _props$Preview === void 0 ? ChannelPreviewLastMessage$1 : _props$Preview,
        _props$watchers = props.watchers,
        watchers = _props$watchers === void 0 ? {} : _props$watchers;
    var previewProps = {
      Avatar: Avatar$1,
      channel: item,
      Preview,
      activeChannel: channel,
      setActiveChannel,
      watchers,
      key: item.id,
      // To force the update of preview component upon channel update.
      channelUpdateCount
    };
    return smartRender(ChannelPreview, _objectSpread$9({}, previewProps));
  }; // renders the empty state indicator (when there are no channels)


  var renderEmptyStateIndicator = function renderEmptyStateIndicator() {
    var _props$EmptyStateIndi = props.EmptyStateIndicator,
        EmptyStateIndicator = _props$EmptyStateIndi === void 0 ? DefaultEmptyStateIndicator : _props$EmptyStateIndi;
    return /*#__PURE__*/React.createElement(EmptyStateIndicator, {
      listType: "channel"
    });
  }; // renders the list.


  var renderList = function renderList() {
    var _props$Avatar2 = props.Avatar,
        Avatar$1 = _props$Avatar2 === void 0 ? Avatar : _props$Avatar2,
        _props$List = props.List,
        List = _props$List === void 0 ? ChannelListTeam : _props$List,
        _props$Paginator = props.Paginator,
        Paginator = _props$Paginator === void 0 ? LoadMorePaginator$1 : _props$Paginator,
        showSidebar = props.showSidebar,
        _props$LoadingIndicat = props.LoadingIndicator,
        LoadingIndicator = _props$LoadingIndicat === void 0 ? LoadingChannels$1 : _props$LoadingIndicat,
        _props$LoadingErrorIn = props.LoadingErrorIndicator,
        LoadingErrorIndicator = _props$LoadingErrorIn === void 0 ? ChatDown$1 : _props$LoadingErrorIn;
    return /*#__PURE__*/React.createElement(List, {
      loading: status.loadingChannels,
      error: status.error,
      showSidebar: showSidebar,
      Avatar: Avatar$1,
      LoadingIndicator: LoadingIndicator,
      LoadingErrorIndicator: LoadingErrorIndicator
    }, !loadedChannels || loadedChannels.length === 0 ? renderEmptyStateIndicator() : smartRender(Paginator, {
      loadNextPage,
      hasNextPage,
      refreshing: status.refreshing,
      children: loadedChannels.map(renderChannel)
    }));
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "str-chat str-chat-channel-list ".concat(theme, " ").concat(navOpen ? 'str-chat-channel-list--open' : ''),
    ref: channelListRef
  }, renderList()));
};

ChannelList.propTypes = {
  /**
   * Custom UI component to display user avatar
   *
   * Defaults to and accepts same props as: [Avatar](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Avatar/Avatar.js)
   * */
  Avatar:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').AvatarProps>>} */
  PropTypes.elementType,

  /** Indicator for Empty State */
  EmptyStateIndicator:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').EmptyStateIndicatorProps>>} */
  PropTypes.elementType,

  /**
   * Available built-in options (also accepts the same props as):
   *
   * 1. [ChannelPreviewCompact](https://getstream.github.io/stream-chat-react/#ChannelPreviewCompact) (default)
   * 2. [ChannelPreviewLastMessage](https://getstream.github.io/stream-chat-react/#ChannelPreviewLastMessage)
   * 3. [ChannelPreviewMessanger](https://getstream.github.io/stream-chat-react/#ChannelPreviewMessanger)
   *
   * The Preview to use, defaults to ChannelPreviewLastMessage
   * */
  Preview:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').ChannelPreviewUIComponentProps>>} */
  PropTypes.elementType,

  /**
   * Loading indicator UI Component. It will be displayed until the channels are
   * being queried from API. Once the channels are loaded/queried, loading indicator is removed
   * and replaced with children of the Channel component.
   *
   * Defaults to and accepts same props as:
   * [LoadingChannels](https://github.com/GetStream/stream-chat-react/blob/master/src/components/LoadingChannels.js)
   *
   */
  LoadingIndicator:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').LoadingIndicatorProps>>} */
  PropTypes.elementType,

  /**
   * Error indicator UI Component. It will be displayed if there is any error if loading the channels.
   * This error could be related to network or failing API.
   *
   * Defaults to and accepts same props as:
   * [ChatDown](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChatDown.js)
   *
   */
  LoadingErrorIndicator:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').ChatDownProps>>} */
  PropTypes.elementType,

  /**
   * Custom UI Component for container of list of channels. Note that, list (UI component) of channels is passed
   * to this component as children. This component is for the purpose of adding header to channel list or styling container
   * for list of channels.
   *
   * Available built-in options (also accepts the same props as):
   *
   * 1. [ChannelListTeam](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelListTeam.js) (default)
   * 2. [ChannelListMessenger](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelListMessenger.js)
   *
   * It has access to some additional props:
   *
   * - `setActiveChannel` {function} Check [chat context](https://getstream.github.io/stream-chat-react/#chat)
   * - `activeChannel` Currently active channel object
   * - `channels` {array} List of channels in channel list
   */
  List:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').ChannelListUIComponentProps>>} */
  PropTypes.elementType,

  /**
   * Paginator component for channels. It contains all the pagination logic such as
   * - fetching next page of results when needed e.g., when scroll reaches the end of list
   * - UI to display loading indicator when next page is being loaded
   * - call to action button to trigger loading of next page.
   *
   * Available built-in options (also accepts the same props as):
   *
   * 1. [LoadMorePaginator](https://github.com/GetStream/stream-chat-react/blob/master/src/components/LoadMorePaginator.js)
   * 2. [InfiniteScrollPaginator](https://github.com/GetStream/stream-chat-react/blob/master/src/components/InfiniteScrollPaginator.js)
   */
  Paginator:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').PaginatorProps>>} */
  PropTypes.elementType,

  /**
   * Function that overrides default behaviour when new message is received on channel that is not being watched
   *
   * @param {Component} setChannels Setter for channels value in state.
   * @param {Event}     event       [Event object](https://getstream.io/chat/docs/event_object/?language=js) corresponding to `notification.message_new` event
   * */
  onMessageNew: PropTypes.func,

  /**
   * Function that overrides default behaviour when users gets added to a channel
   *
   * @param {Component} setChannels Setter for channels value in state.
   * @param {Event}     event       [Event object](https://getstream.io/chat/docs/event_object/?language=js) corresponding to `notification.added_to_channel` event
   * */
  onAddedToChannel: PropTypes.func,

  /**
   * Function that overrides default behaviour when users gets removed from a channel
   *
   * @param {Component} setChannels Setter for channels value in state.
   * @param {Event}     event       [Event object](https://getstream.io/chat/docs/event_object/?language=js) corresponding to `notification.removed_from_channel` event
   * */
  onRemovedFromChannel: PropTypes.func,

  /**
   * Function that overrides default behaviour when channel gets updated
   *
   * @param {Component} setChannels Setter for channels value in state.
   * @param {Event}     event       [Event object](https://getstream.io/chat/docs/event_object/?language=js) corresponding to `notification.channel_updated` event
   * */
  onChannelUpdated: PropTypes.func,

  /**
   * Function to customize behaviour when channel gets truncated
   *
   * @param {Component} setChannels Setter for channels value in state.
   * @param {Event}     event       [Event object](https://getstream.io/chat/docs/event_object/?language=js) corresponding to `channel.truncated` event
   * */
  onChannelTruncated: PropTypes.func,

  /**
   * Function that overrides default behaviour when channel gets deleted. In absence of this prop, channel will be removed from the list.
   *
   * @param {Component} setChannels Setter for channels value in state.
   * @param {Event}     event       [Event object](https://getstream.io/chat/docs/event_object/?language=js) corresponding to `channel.deleted` event
   * */
  onChannelDeleted: PropTypes.func,

  /**
   * Optional function to filter channels prior to loading in the DOM. Do not use any complex or async logic here that would significantly delay the loading of the ChannelList.
   * We recommend using a pure function with array methods like filter/sort/reduce.
   * @param {Array} channels
   * @returns {Array} channels
   * */
  channelRenderFilterFn:
  /** @type {PropTypes.Validator<(channels: import('stream-chat').Channel[]) => import('stream-chat').Channel[]>} */
  PropTypes.func,

  /**
   * Object containing query filters
   * @see See [Channel query documentation](https://getstream.io/chat/docs/query_channels/?language=js) for a list of available fields for filter.
   * */
  filters:
  /** @type {PropTypes.Validator<import('stream-chat').ChannelFilters>} */
  PropTypes.object,

  /**
   * Object containing query options
   * @see See [Channel query documentation](https://getstream.io/chat/docs/query_channels/?language=js) for a list of available fields for options.
   * */
  options: PropTypes.object,

  /**
   * Object containing sort parameters
   * @see See [Channel query documentation](https://getstream.io/chat/docs/query_channels/?language=js) for a list of available fields for sort.
   * */
  sort:
  /** @type {PropTypes.Validator<import('stream-chat').ChannelSort>} */
  PropTypes.object,

  /**
   * Object containing watcher parameters
   * @see See [Pagination documentation](https://getstream.io/chat/docs/channel_pagination/?language=js) for a list of available fields for sort.
   * */
  watchers:
  /** @type {PropTypes.Validator<{ limit?: number | undefined; offset?: number | undefined} | null | undefined> | undefined} */
  PropTypes.object,

  /**
   * Set a Channel (of this id) to be active and move it to the top of the list of channels by ID.
   * */
  customActiveChannel: PropTypes.string,

  /**
   * Last channel will be set as active channel if true, defaults to true
   */
  setActiveChannelOnMount: PropTypes.bool,

  /**
   * If true, channels won't be dynamically sorted by most recent message.
   */
  lockChannelOrder: PropTypes.bool,

  /**
   * When client receives an event `message.new`, we push that channel to top of the list.
   *
   * But If the channel doesn't exist in the list, then we get the channel from client
   * (client maintains list of watched channels as `client.activeChannels`) and push
   * that channel to top of the list by default. You can disallow this behavior by setting following
   * prop to false. This is quite usefull where you have multiple tab structure and you don't want
   * ChannelList in Tab1 to react to new message on some channel in Tab2.
   *
   * Default value is true.
   */
  allowNewMessagesFromUnfilteredChannels: PropTypes.bool
};
var ChannelList$1 = /*#__PURE__*/React.memo(ChannelList);

// @ts-check
/**
 * ChannelList - A preview list of channels, allowing you to select the channel you want to open
 * @example ../../docs/ChannelList.md
 * @type React.FC<import('../types').ChannelListUIComponentProps>
 */

var ChannelListMessenger = function ChannelListMessenger(_ref) {
  var _ref$error = _ref.error,
      error = _ref$error === void 0 ? false : _ref$error,
      loading = _ref.loading,
      _ref$LoadingErrorIndi = _ref.LoadingErrorIndicator,
      LoadingErrorIndicator = _ref$LoadingErrorIndi === void 0 ? ChatDown$1 : _ref$LoadingErrorIndi,
      _ref$LoadingIndicator = _ref.LoadingIndicator,
      LoadingIndicator = _ref$LoadingIndicator === void 0 ? LoadingChannels$1 : _ref$LoadingIndicator,
      children = _ref.children;

  if (error) {
    return /*#__PURE__*/React.createElement(LoadingErrorIndicator, {
      type: "Connection Error"
    });
  }

  if (loading) {
    return /*#__PURE__*/React.createElement(LoadingIndicator, null);
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "str-chat__channel-list-messenger"
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__channel-list-messenger__main"
  }, children));
};
ChannelListMessenger.propTypes = {
  /** When true, loading indicator is shown - [LoadingChannels](https://github.com/GetStream/stream-chat-react/blob/master/src/components/LoadingChannels.js) */
  loading: PropTypes.bool,

  /** When true, error indicator is shown - [ChatDown](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChatDown.js) */
  error: PropTypes.bool,

  /**
   * Loading indicator UI Component. It will be displayed if `loading` prop is true.
   *
   * Defaults to and accepts same props as:
   * [LoadingChannels](https://github.com/GetStream/stream-chat-react/blob/master/src/components/LoadingChannels.js)
   *
   */
  LoadingIndicator:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').LoadingIndicatorProps>>} */
  PropTypes.elementType,

  /**
   * Error indicator UI Component. It will be displayed if `error` prop is true
   *
   * Defaults to and accepts same props as:
   * [ChatDown](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChatDown.js)
   *
   */
  LoadingErrorIndicator:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').ChatDownProps>>} */
  PropTypes.elementType
};

// @ts-check
/**
 * @type {React.FC}
 */

var ChannelSearch = function ChannelSearch() {
  return /*#__PURE__*/React.createElement("div", {
    className: "str-chat__channel-search"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Search"
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "17",
    viewBox: "0 0 18 17",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0 17.015l17.333-8.508L0 0v6.617l12.417 1.89L0 10.397z",
    fillRule: "evenodd"
  }))));
};

var ChannelSearch$1 = /*#__PURE__*/React.memo(ChannelSearch);

var version="4.1.3";

function ownKeys$a(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$a(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$a(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$a(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var useChat = function useChat(_ref) {
  var _client$user;

  var client = _ref.client,
      initialNavOpen = _ref.initialNavOpen,
      i18nInstance = _ref.i18nInstance;

  var _useState = useState(
  /** @type { Required<import('../types').TranslationContextValue>} */
  {
    t:
    /** @param {string} key */
    function t(key) {
      return key;
    },
    tDateTimeParser: function tDateTimeParser(input) {
      return Dayjs(input);
    },
    userLanguage: ''
  }),
      _useState2 = _slicedToArray(_useState, 2),
      translators = _useState2[0],
      setTranslators = _useState2[1];

  var _useState3 = useState(
  /** @type {import('stream-chat').Mute[]} */
  []),
      _useState4 = _slicedToArray(_useState3, 2),
      mutes = _useState4[0],
      setMutes = _useState4[1];

  var _useState5 = useState(initialNavOpen),
      _useState6 = _slicedToArray(_useState5, 2),
      navOpen = _useState6[0],
      setNavOpen = _useState6[1];

  var _useState7 = useState(
  /** @type {ChannelState} */
  undefined),
      _useState8 = _slicedToArray(_useState7, 2),
      channel = _useState8[0],
      setChannel = _useState8[1];

  var openMobileNav = function openMobileNav() {
    return setTimeout(function () {
      return setNavOpen(true);
    }, 100);
  };

  var closeMobileNav = function closeMobileNav() {
    return setNavOpen(false);
  };

  var clientMutes = client === null || client === void 0 ? void 0 : (_client$user = client.user) === null || _client$user === void 0 ? void 0 : _client$user.mutes;
  useEffect(function () {
    if (client) {
      var userAgent = client.getUserAgent();

      if (!userAgent.includes('stream-chat-react')) {
        /**
         * results in something like: 'stream-chat-react-2.3.2-stream-chat-javascript-client-browser-2.2.2'
         */
        client.setUserAgent("stream-chat-react-".concat(version, "-").concat(userAgent));
      }
    }
  }, [client]);
  useEffect(function () {
    setMutes(clientMutes || []);
    /** @param {import('stream-chat').Event} e */

    var handleEvent = function handleEvent(e) {
      var _e$me;

      if (e.type === 'notification.mutes_updated') setMutes(((_e$me = e.me) === null || _e$me === void 0 ? void 0 : _e$me.mutes) || []);
    };

    if (client) client.on(handleEvent);
    return function () {
      return client && client.off(handleEvent);
    };
  }, [client, clientMutes]);
  useEffect(function () {
    var streami18n;

    if (i18nInstance instanceof Streami18n) {
      streami18n = i18nInstance;
    } else {
      streami18n = new Streami18n({
        language: 'en'
      });
    }

    streami18n.registerSetLanguageCallback(function (t) {
      return setTranslators(function (prevTranslator) {
        return _objectSpread$a(_objectSpread$a({}, prevTranslator), {}, {
          t
        });
      });
    });
    streami18n.getTranslators().then(function (translator) {
      if (translator) {
        var _client$user2;

        setTranslators(_objectSpread$a(_objectSpread$a({}, translator), {}, {
          userLanguage: (client === null || client === void 0 ? void 0 : (_client$user2 = client.user) === null || _client$user2 === void 0 ? void 0 : _client$user2.language) || ''
        }));
      }
    });
  }, [client, i18nInstance]);
  var setActiveChannel = useCallback(
  /*#__PURE__*/

  /**
   * @param {ChannelState} activeChannel
   * @param {{ limit?: number; offset?: number }} [watchers]
   * @param {React.BaseSyntheticEvent} [e]
   */
  function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(activeChannel) {
      var watchers,
          e,
          _args = arguments;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              watchers = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
              e = _args.length > 2 ? _args[2] : undefined;
              if (e && e.preventDefault) e.preventDefault();

              if (!(activeChannel && Object.keys(watchers).length)) {
                _context.next = 6;
                break;
              }

              _context.next = 6;
              return activeChannel.query({
                watch: true,
                watchers
              });

            case 6:
              setChannel(activeChannel);
              closeMobileNav();

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }(), []);
  return {
    channel,
    closeMobileNav,
    mutes,
    navOpen,
    openMobileNav,
    setActiveChannel,
    translators
  };
};

/**
 * Chat - Wrapper component for Chat. The needs to be placed around any other chat components.
 * This Chat component provides the ChatContext to all other components.
 *
 * The ChatContext provides the following props:
 *
 * - client (the client connection)
 * - channels (the list of channels)
 * - setActiveChannel (a function to set the currently active channel)
 * - channel (the currently active channel)
 *
 * It also exposes the withChatContext HOC which you can use to consume the ChatContext
 *
 * @example ../../docs/Chat.md
 * @typedef {import('stream-chat').Channel | undefined} ChannelState
 * @type {React.FC<import('../types').ChatProps>}
 */

var Chat = function Chat(props) {
  var children = props.children,
      client = props.client,
      i18nInstance = props.i18nInstance,
      _props$initialNavOpen = props.initialNavOpen,
      initialNavOpen = _props$initialNavOpen === void 0 ? true : _props$initialNavOpen,
      _props$theme = props.theme,
      theme = _props$theme === void 0 ? 'messaging light' : _props$theme;

  var _useChat = useChat({
    client,
    initialNavOpen,
    i18nInstance
  }),
      channel = _useChat.channel,
      closeMobileNav = _useChat.closeMobileNav,
      mutes = _useChat.mutes,
      navOpen = _useChat.navOpen,
      openMobileNav = _useChat.openMobileNav,
      setActiveChannel = _useChat.setActiveChannel,
      translators = _useChat.translators;

  if (!translators.t) return null;
  return /*#__PURE__*/React.createElement(ChatContext.Provider, {
    value: {
      client,
      channel,
      closeMobileNav,
      mutes,
      navOpen,
      openMobileNav,
      setActiveChannel,
      theme
    }
  }, /*#__PURE__*/React.createElement(TranslationContext.Provider, {
    value: translators
  }, children));
};

Chat.propTypes = {
  /** The StreamChat client object */
  client:
  /** @type {PropTypes.Validator<import('stream-chat').StreamChat>} */
  PropTypes.object.isRequired,

  /**
   *
   * Theme could be used for custom styling of the components.
   *
   * You can override the classes used in our components under parent theme class.
   *
   * e.g. If you want to build a theme where background of message is black
   *
   * ```
   *  <Chat client={client} theme={demo}>
   *    <Channel>
   *      <MessageList />
   *    </Channel>
   *  </Chat>
   * ```
   *
   * ```scss
   *  .demo.str-chat {
   *    .str-chat__message-simple {
   *      &-text-inner {
   *        background-color: black;
   *      }
   *    }
   *  }
   * ```
   *
   * Built in available themes:
   *
   *  - `messaging light`
   *  - `messaging dark`
   *  - `team light`
   *  - `team dark`
   *  - `commerce light`
   *  - `commerce dark`
   *  - `livestream light`
   *  - `livestream dark`
   */
  theme: PropTypes.string,

  /** navOpen initial status */
  initialNavOpen: PropTypes.bool
};

// @ts-check
/**
 * DateSeparator - A simple date separator
 *
 * @example ../../docs/DateSeparator.md
 * @type {React.FC<import('../types').DateSeparatorProps>}
 */

var DateSeparator = function DateSeparator(_ref) {
  var _ref$position = _ref.position,
      position = _ref$position === void 0 ? 'right' : _ref$position,
      formatDate = _ref.formatDate,
      date = _ref.date,
      unread = _ref.unread;

  var _useContext = useContext(TranslationContext),
      t = _useContext.t,
      tDateTimeParser = _useContext.tDateTimeParser;

  if (typeof date === 'string') return null;
  var formattedDate = formatDate ? formatDate(date) : tDateTimeParser(date.toISOString()).calendar();
  return /*#__PURE__*/React.createElement("div", {
    className: "str-chat__date-separator"
  }, (position === 'right' || position === 'center') && /*#__PURE__*/React.createElement("hr", {
    className: "str-chat__date-separator-line"
  }), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__date-separator-date"
  }, unread ? t('New') : formattedDate), (position === 'left' || position === 'center') && /*#__PURE__*/React.createElement("hr", {
    className: "str-chat__date-separator-line"
  }));
};

DateSeparator.propTypes = {
  /** The date to format */
  date: PropTypes.instanceOf(Date).isRequired,

  /** If following messages are not new */
  unread: PropTypes.bool,

  /** Set the position of the date in the separator */
  position: PropTypes.oneOf(['left', 'center', 'right']),

  /** Override the default formatting of the date. This is a function that has access to the original date object. Returns a string or Node  */
  formatDate: PropTypes.func
};
var DefaultDateSeparator = /*#__PURE__*/React.memo(DateSeparator);

// @ts-check
/**
 * EventComponent - Custom render component for system and channel event messages
 * @type {React.FC<import('../types').EventComponentProps>}
 */

var EventComponent = function EventComponent(_ref) {
  var _ref$Avatar = _ref.Avatar,
      Avatar$1 = _ref$Avatar === void 0 ? Avatar : _ref$Avatar,
      message = _ref.message;

  var _useContext = useContext(TranslationContext),
      tDateTimeParser = _useContext.tDateTimeParser;

  var type = message.type,
      text = message.text,
      event = message.event,
      _message$created_at = message.created_at,
      created_at = _message$created_at === void 0 ? '' : _message$created_at;
  if (type === 'system') return /*#__PURE__*/React.createElement("div", {
    className: "str-chat__message--system"
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__message--system__text"
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__message--system__line"
  }), /*#__PURE__*/React.createElement("p", null, text), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__message--system__line"
  })), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__message--system__date"
  }, /*#__PURE__*/React.createElement("strong", null, tDateTimeParser(created_at).format('dddd'), " "), "at ", tDateTimeParser(created_at).format('hh:mm A')));

  if (type === 'channel.event' && event && (event.type === 'member.removed' || event.type === 'member.added')) {
    var _event$user, _event$user2, _event$user3;

    var name = (event === null || event === void 0 ? void 0 : (_event$user = event.user) === null || _event$user === void 0 ? void 0 : _event$user.name) || (event === null || event === void 0 ? void 0 : (_event$user2 = event.user) === null || _event$user2 === void 0 ? void 0 : _event$user2.id);
    var sentence = "".concat(name, " ").concat(event.type === 'member.added' ? 'has joined the chat' : 'was removed from the chat');
    return /*#__PURE__*/React.createElement("div", {
      className: "str-chat__event-component__channel-event"
    }, /*#__PURE__*/React.createElement(Avatar$1, {
      image: event === null || event === void 0 ? void 0 : (_event$user3 = event.user) === null || _event$user3 === void 0 ? void 0 : _event$user3.image,
      name: name
    }), /*#__PURE__*/React.createElement("div", {
      className: "str-chat__event-component__channel-event__content"
    }, /*#__PURE__*/React.createElement("em", {
      className: "str-chat__event-component__channel-event__sentence"
    }, sentence), /*#__PURE__*/React.createElement("div", {
      className: "str-chat__event-component__channel-event__date"
    }, tDateTimeParser(created_at).format('LT'))));
  }

  return null;
};

EventComponent.propTypes = {
  /** Message object */
  // @ts-expect-error
  message: PropTypes.object.isRequired,

  /**
   * Custom UI component to display user avatar
   *
   * Defaults to and accepts same props as: [Avatar](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Avatar/Avatar.js)
   * */
  Avatar:
  /** @type {PropTypes.Validator<React.ElementType<import('../types').AvatarProps>>} */
  PropTypes.elementType
};
var EventComponent$1 = /*#__PURE__*/React.memo(EventComponent);

function ownKeys$b(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$b(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$b(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$b(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
/**
 * Prevents Chrome hangups
 * See: https://stackoverflow.com/questions/47524205/random-high-content-download-time-in-chrome/47684257#47684257
 * @param {Event} e
 */

var mousewheelListener = function mousewheelListener(e) {
  if (e instanceof WheelEvent && e.deltaY === 1) {
    e.preventDefault();
  }
};
/**
 * @param {HTMLElement | Element | null} el
 * @returns {number}
 */


var calculateTopPosition = function calculateTopPosition(el) {
  if (el instanceof HTMLElement) {
    return el.offsetTop + calculateTopPosition(el.offsetParent);
  }

  return 0;
};
/**
 * Computes by recursively summing offsetTop until an element without offsetParent is reached
 * @param {HTMLElement} el
 * @param {number} scrollTop
 */


var calculateOffset = function calculateOffset(el, scrollTop) {
  if (!el) {
    return 0;
  }

  return calculateTopPosition(el) + (el.offsetHeight - scrollTop - window.innerHeight);
};
/** @param {import("types").InfiniteScrollProps} props */


var InfiniteScroll = function InfiniteScroll(_ref) {
  var children = _ref.children,
      _ref$element = _ref.element,
      element = _ref$element === void 0 ? 'div' : _ref$element,
      _ref$hasMore = _ref.hasMore,
      hasMore = _ref$hasMore === void 0 ? false : _ref$hasMore,
      _ref$initialLoad = _ref.initialLoad,
      initialLoad = _ref$initialLoad === void 0 ? true : _ref$initialLoad,
      _ref$isReverse = _ref.isReverse,
      isReverse = _ref$isReverse === void 0 ? false : _ref$isReverse,
      loader = _ref.loader,
      loadMore = _ref.loadMore,
      _ref$threshold = _ref.threshold,
      threshold = _ref$threshold === void 0 ? 250 : _ref$threshold,
      _ref$useCapture = _ref.useCapture,
      useCapture = _ref$useCapture === void 0 ? false : _ref$useCapture,
      _ref$useWindow = _ref.useWindow,
      useWindow = _ref$useWindow === void 0 ? true : _ref$useWindow,
      _ref$isLoading = _ref.isLoading,
      isLoading = _ref$isLoading === void 0 ? false : _ref$isLoading,
      listenToScroll = _ref.listenToScroll,
      elementProps = _objectWithoutProperties(_ref, ["children", "element", "hasMore", "initialLoad", "isReverse", "loader", "loadMore", "threshold", "useCapture", "useWindow", "isLoading", "listenToScroll"]);

  var scrollComponent = useRef(
  /** @type {HTMLElement | null} */
  null);
  var scrollListener = useCallback(function () {
    var el = scrollComponent.current;
    if (!el) return;
    var parentElement = el.parentElement;
    var offset = 0;
    var reverseOffset = 0;

    if (useWindow) {
      var doc = document.documentElement || document.body.parentNode || document.body;
      var scrollTop = window.pageYOffset !== undefined ? window.pageYOffset : doc.scrollTop;
      offset = calculateOffset(el, scrollTop);
      reverseOffset = scrollTop;
    } else if (parentElement) {
      offset = el.scrollHeight - parentElement.scrollTop - parentElement.clientHeight;
      reverseOffset = parentElement.scrollTop;
    }

    if (listenToScroll) {
      listenToScroll(offset, reverseOffset, threshold);
    } // Here we make sure the element is visible as well as checking the offset


    if ((isReverse ? reverseOffset : offset) < Number(threshold) && el.offsetParent !== null && typeof loadMore === 'function' && hasMore) {
      loadMore();
    }
  }, [hasMore, useWindow, isReverse, threshold, listenToScroll, loadMore]);
  useEffect(function () {
    var _scrollComponent$curr;

    var scrollEl = useWindow ? window : (_scrollComponent$curr = scrollComponent.current) === null || _scrollComponent$curr === void 0 ? void 0 : _scrollComponent$curr.parentNode;

    if (isLoading || !scrollEl) {
      return function () {};
    }

    scrollEl.addEventListener('scroll', scrollListener, useCapture);
    scrollEl.addEventListener('resize', scrollListener, useCapture);

    if (initialLoad) {
      scrollListener();
    }

    return function () {
      scrollEl.removeEventListener('scroll', scrollListener, useCapture);
      scrollEl.removeEventListener('resize', scrollListener, useCapture);
    };
  }, [initialLoad, isLoading, scrollListener, useCapture, useWindow]);
  useEffect(function () {
    var _scrollComponent$curr2;

    var scrollEl = useWindow ? window : (_scrollComponent$curr2 = scrollComponent.current) === null || _scrollComponent$curr2 === void 0 ? void 0 : _scrollComponent$curr2.parentNode;
    if (!scrollEl) return function () {};
    scrollEl.addEventListener('mousewheel', mousewheelListener, useCapture);
    return function () {
      return scrollEl.removeEventListener('mousewheel', mousewheelListener, useCapture);
    };
  }, [useCapture, useWindow]);

  var attributes = _objectSpread$b(_objectSpread$b({}, elementProps), {}, {
    /** @param {HTMLElement} e */
    ref: function ref(e) {
      scrollComponent.current = e;
    }
  });

  var childrenArray = [children];

  if (isLoading && loader) {
    if (isReverse) {
      childrenArray.unshift(loader);
    } else {
      childrenArray.push(loader);
    }
  }

  return /*#__PURE__*/React.createElement(element, attributes, childrenArray);
};

InfiniteScroll.propTypes = {
  element: PropTypes.elementType,
  hasMore: PropTypes.bool,
  initialLoad: PropTypes.bool,
  isReverse: PropTypes.bool,
  loader: PropTypes.node,
  loadMore: PropTypes.func.isRequired,
  pageStart: PropTypes.number,
  isLoading: PropTypes.bool,
  threshold: PropTypes.number,
  useCapture: PropTypes.bool,
  useWindow: PropTypes.bool
};

// @ts-check
/**
 * @type { React.FC<import('../types').InfiniteScrollPaginatorProps>}
 */

var InfiniteScrollPaginator = function InfiniteScrollPaginator(_ref) {
  var _ref$LoadingIndicator = _ref.LoadingIndicator,
      LoadingIndicator = _ref$LoadingIndicator === void 0 ? LoadingIndicator$1 : _ref$LoadingIndicator,
      loadNextPage = _ref.loadNextPage,
      hasNextPage = _ref.hasNextPage,
      refreshing = _ref.refreshing,
      reverse = _ref.reverse,
      threshold = _ref.threshold,
      children = _ref.children;
  return /*#__PURE__*/React.createElement(InfiniteScroll, {
    loadMore: loadNextPage,
    hasMore: hasNextPage,
    isLoading: refreshing,
    isReverse: reverse,
    threshold: threshold,
    useWindow: false,
    loader: /*#__PURE__*/React.createElement("div", {
      className: "str-chat__infinite-scroll-paginator",
      key: "loadingindicator"
    }, /*#__PURE__*/React.createElement(LoadingIndicator, null))
  }, children);
};

InfiniteScrollPaginator.propTypes = {
  /** callback to load the next page */
  loadNextPage: PropTypes.func.isRequired,

  /** indicates if there is a next page to load */
  hasNextPage: PropTypes.bool,

  /** indicates if there there's currently any refreshing taking place */
  refreshing: PropTypes.bool,

  /** display the items in opposite order */
  reverse: PropTypes.bool,

  /** Offset from when to start the loadNextPage call */
  threshold: PropTypes.number,

  /** The loading indicator to use */
  // @ts-expect-error
  LoadingIndicator: PropTypes.elementType
};

/** @type {React.FC<import("types").InfiniteScrollProps>} */

var ReverseInfiniteScroll = function ReverseInfiniteScroll(props) {
  return /*#__PURE__*/React.createElement(InfiniteScroll, _extends({}, props, {
    isReverse: true
  }));
};

var Center = function Center(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/React.createElement("div", {
    className: "str-chat__list__center"
  }, children);
};

var Center$1 = /*#__PURE__*/React.memo(Center);

// @ts-check
/** @type {React.FC<import('../types').MessageNotificationProps>} */

var MessageNotification = function MessageNotification(_ref) {
  var showNotification = _ref.showNotification,
      onClick = _ref.onClick,
      children = _ref.children;
  if (!showNotification) return null;
  return /*#__PURE__*/React.createElement("button", {
    "data-testid": "message-notification",
    className: "str-chat__message-notification",
    onClick: onClick
  }, children);
};

MessageNotification.defaultProps = {
  showNotification: true
};
MessageNotification.propTypes = {
  /** If we should show the notification or not */
  showNotification: PropTypes.bool.isRequired,

  /** Onclick handler */
  onClick: PropTypes.func.isRequired
};
var MessageNotification$1 = /*#__PURE__*/React.memo(MessageNotification);

var CustomNotification = function CustomNotification(_ref) {
  var children = _ref.children,
      active = _ref.active,
      type = _ref.type;
  if (!active) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "str-chat__custom-notification notification-".concat(type),
    "data-testid": "custom-notification"
  }, children);
};

CustomNotification.propTypes = {
  active: PropTypes.bool,
  type: PropTypes.string
};
var CustomNotification$1 = /*#__PURE__*/React.memo(CustomNotification);

/**
 * ConnectionStatus - Indicator that there is a connection failure
 * @type {React.FC<{}>}
 */

var ConnectionStatus = function ConnectionStatus() {
  var _useContext = useContext(ChatContext),
      client = _useContext.client;

  var _useContext2 = useContext(TranslationContext),
      t = _useContext2.t;

  var _useState = useState(true),
      _useState2 = _slicedToArray(_useState, 2),
      online = _useState2[0],
      setOnline = _useState2[1];

  useEffect(function () {
    /** @param {import('stream-chat').Event} e */
    var connectionChanged = function connectionChanged(e) {
      if (e.online !== online) setOnline(
      /** @type {boolean} */
      e.online);
    };

    client.on('connection.changed', connectionChanged);
    return function () {
      return client.off('connection.changed', connectionChanged);
    };
  }, [client, online]);
  return /*#__PURE__*/React.createElement(CustomNotification$1, {
    active: !online,
    type: "error"
  }, t('Connection failure, reconnecting now...'));
};

var ConnectionStatus$1 = /*#__PURE__*/React.memo(ConnectionStatus);

var getLastReceived = function getLastReceived(messages) {
  for (var i = messages.length - 1; i > 0; i -= 1) {
    if (messages[i].status === 'received') return messages[i].id;
  }

  return null;
};

var getReadStates = function getReadStates(messages, read) {
  // create object with empty array for each message id
  var readData = {};
  Object.values(read).forEach(function (readState) {
    if (!readState.last_read) return;
    var userLastReadMsgId;
    messages.forEach(function (msg) {
      if (msg.updated_at < readState.last_read) userLastReadMsgId = msg.id;
    });

    if (userLastReadMsgId) {
      if (!readData[userLastReadMsgId]) readData[userLastReadMsgId] = [];
      readData[userLastReadMsgId].push(readState.user);
    }
  });
  return readData;
};

var insertDates = function insertDates(messages, lastRead, userID, hideDeletedMessages) {
  var unread = false;
  var lastDateSeparator;
  var newMessages = [];

  for (var i = 0, l = messages.length; i < l; i += 1) {
    var _messages, _newMessages;

    var message = messages[i];

    if (hideDeletedMessages && message.type === 'deleted') {
      continue;
    }

    if (message.type === 'message.read') {
      newMessages.push(message);
      continue;
    }

    var messageDate = message.created_at.toDateString();
    var prevMessageDate = messageDate;

    if (i > 0) {
      prevMessageDate = messages[i - 1].created_at.toDateString();
    }

    if (!unread) {
      unread = lastRead && new Date(lastRead) < message.created_at; // do not show date separator for current user's messages

      if (unread && message.user.id !== userID) {
        newMessages.push({
          type: 'message.date',
          date: message.created_at,
          unread
        });
      }
    }

    if ((i === 0 || messageDate !== prevMessageDate || hideDeletedMessages && ((_messages = messages[i - 1]) === null || _messages === void 0 ? void 0 : _messages.type) === 'deleted' && lastDateSeparator !== messageDate) && (newMessages === null || newMessages === void 0 ? void 0 : (_newMessages = newMessages[newMessages.length - 1]) === null || _newMessages === void 0 ? void 0 : _newMessages.type) !== 'message.date' // do not show two date separators in a row
    ) {
        lastDateSeparator = messageDate;
        newMessages.push({
          type: 'message.date',
          date: message.created_at
        }, message);
      } else {
      newMessages.push(message);
    }
  }

  return newMessages;
};

var insertIntro = function insertIntro(messages, headerPosition) {
  var newMessages = messages; // if no headerPosition is set, HeaderComponent will go at the top

  if (!headerPosition) {
    newMessages.unshift({
      type: 'channel.intro'
    });
    return newMessages;
  } // if no messages, intro gets inserted


  if (!newMessages.length) {
    newMessages.unshift({
      type: 'channel.intro'
    });
    return newMessages;
  } // else loop over the messages


  for (var i = 0, l = messages.length; i < l; i += 1) {
    var message = messages[i];
    var messageTime = message.created_at ? message.created_at.getTime() : null;
    var nextMessageTime = messages[i + 1] && messages[i + 1].created_at ? messages[i + 1].created_at.getTime() : null; // header position is smaller than message time so comes after;

    if (messageTime < headerPosition) {
      // if header position is also smaller than message time continue;
      if (nextMessageTime < headerPosition) {
        if (messages[i + 1] && messages[i + 1].type === 'message.date') continue;

        if (!nextMessageTime) {
          newMessages.push({
            type: 'channel.intro'
          });
          return newMessages;
        }

        continue;
      } else {
        newMessages.splice(i + 1, 0, {
          type: 'channel.intro'
        });
        return newMessages;
      }
    }
  }

  return newMessages;
};

var getGroupStyles = function getGroupStyles(message, previousMessage, nextMessage, noGroupByUser) {
  if (message.type === 'message.date') return '';
  if (message.type === 'channel.event') return '';
  if (message.type === 'channel.intro') return '';
  if (noGroupByUser || message.attachments.length !== 0) return 'single';
  var isTopMessage = !previousMessage || previousMessage.type === 'channel.intro' || previousMessage.type === 'message.date' || previousMessage.type === 'system' || previousMessage.type === 'channel.event' || previousMessage.attachments.length !== 0 || message.user.id !== previousMessage.user.id || previousMessage.type === 'error' || previousMessage.deleted_at;
  var isBottomMessage = !nextMessage || nextMessage.type === 'message.date' || nextMessage.type === 'system' || nextMessage.type === 'channel.event' || nextMessage.type === 'channel.intro' || nextMessage.attachments.length !== 0 || message.user.id !== nextMessage.user.id || nextMessage.type === 'error' || nextMessage.deleted_at;

  if (!isTopMessage && !isBottomMessage) {
    if (message.deleted_at || message.type === 'error') return 'single';
    return 'middle';
  }

  if (isBottomMessage) {
    if (isTopMessage || message.deleted_at || message.type === 'error') return 'single';
    return 'bottom';
  }

  if (isTopMessage) return 'top';
  return '';
};

var MessageListInner = function MessageListInner(props) {
  var bottomRef = props.bottomRef,
      client = props.client,
      channel = props.channel,
      DateSeparator = props.DateSeparator,
      _props$disableDateSep = props.disableDateSeparator,
      disableDateSeparator = _props$disableDateSep === void 0 ? false : _props$disableDateSep,
      EmptyStateIndicator = props.EmptyStateIndicator,
      HeaderComponent = props.HeaderComponent,
      headerPosition = props.headerPosition,
      _props$hideDeletedMes = props.hideDeletedMessages,
      hideDeletedMessages = _props$hideDeletedMes === void 0 ? false : _props$hideDeletedMes,
      internalInfiniteScrollProps = props.internalInfiniteScrollProps,
      internalMessageProps = props.internalMessageProps,
      messages = props.messages,
      MessageSystem = props.MessageSystem,
      noGroupByUser = props.noGroupByUser,
      onMessageLoadCaptured = props.onMessageLoadCaptured,
      read = props.read,
      threadList = props.threadList,
      TypingIndicator = props.TypingIndicator;
  var lastRead = useMemo(function () {
    return channel.lastRead();
  }, [channel]);

  var enrichMessages = function enrichMessages() {
    var messageWithDates = disableDateSeparator || threadList ? messages : insertDates(messages, lastRead, client.userID, hideDeletedMessages);
    if (HeaderComponent) return insertIntro(messageWithDates, headerPosition);
    return messageWithDates;
  };

  var enrichedMessages = enrichMessages();
  var messageGroupStyles = useMemo(function () {
    return enrichedMessages.reduce(function (acc, message, i) {
      var style = getGroupStyles(message, enrichedMessages[i - 1], enrichedMessages[i + 1], noGroupByUser);
      if (style) acc[message.id] = style;
      return acc;
    }, {});
  }, [enrichedMessages, noGroupByUser]); // get the readData, but only for messages submitted by the user themselves

  var readData = useMemo(function () {
    return getReadStates(enrichedMessages.filter(function (_ref) {
      var user = _ref.user;
      return (user === null || user === void 0 ? void 0 : user.id) === client.userID;
    }), read);
  }, [client.userID, enrichedMessages, read]);
  var lastReceivedId = useMemo(function () {
    return getLastReceived(enrichedMessages);
  }, [enrichedMessages]);
  var elements = useMemo(function () {
    return enrichedMessages.map(function (message) {
      if (message.type === 'message.date') {
        return /*#__PURE__*/React.createElement("li", {
          key: "".concat(message.date.toISOString(), "-i")
        }, /*#__PURE__*/React.createElement(DateSeparator, {
          date: message.date,
          unread: message.unread
        }));
      }

      if (message.type === 'channel.intro') {
        return /*#__PURE__*/React.createElement("li", {
          key: "intro"
        }, /*#__PURE__*/React.createElement(HeaderComponent, null));
      }

      if (message.type === 'channel.event' || message.type === 'system') {
        var _message$event;

        if (!MessageSystem) return null;
        return /*#__PURE__*/React.createElement("li", {
          key: ((_message$event = message.event) === null || _message$event === void 0 ? void 0 : _message$event.created_at) || message.created_at || ''
        }, /*#__PURE__*/React.createElement(MessageSystem, {
          message: message
        }));
      }

      if (message.type !== 'message.read') {
        var groupStyles = messageGroupStyles[message.id] || '';
        return /*#__PURE__*/React.createElement("li", {
          className: "str-chat__li str-chat__li--".concat(groupStyles),
          key: message.id || message.created_at,
          onLoadCapture: onMessageLoadCaptured
        }, /*#__PURE__*/React.createElement(Message$1, _extends({
          client: client,
          groupStyles: [groupStyles]
          /* TODO: convert to simple string */
          ,
          lastReceivedId: lastReceivedId,
          message: message,
          readBy: readData[message.id] || [],
          threadList: threadList
        }, internalMessageProps)));
      }

      return null;
    });
  }, [client, enrichedMessages, internalMessageProps, lastReceivedId, messageGroupStyles, MessageSystem, onMessageLoadCaptured, readData, threadList]);
  if (!elements.length) return /*#__PURE__*/React.createElement(EmptyStateIndicator, {
    listType: "message"
  });
  return /*#__PURE__*/React.createElement(InfiniteScroll, _extends({
    className: "str-chat__reverse-infinite-scroll",
    "data-testid": "reverse-infinite-scroll",
    isReverse: true,
    useWindow: false
  }, internalInfiniteScrollProps), /*#__PURE__*/React.createElement("ul", {
    className: "str-chat__ul"
  }, elements), /*#__PURE__*/React.createElement(TypingIndicator, {
    threadList: threadList
  }), /*#__PURE__*/React.createElement("div", {
    key: "bottom",
    ref: bottomRef
  }));
};

var MessageListInner$1 = /*#__PURE__*/React.memo(MessageListInner, isEqual);

// @ts-check
/**
 * TypingIndicator lists users currently typing, it needs to be a child of Channel component
 * @typedef {import('../types').TypingIndicatorProps} Props
 * @type {React.FC<Props>}
 */

var TypingIndicator = function TypingIndicator(_ref) {
  var _channel$getConfig;

  var _ref$Avatar = _ref.Avatar,
      Avatar$1 = _ref$Avatar === void 0 ? Avatar : _ref$Avatar,
      _ref$avatarSize = _ref.avatarSize,
      avatarSize = _ref$avatarSize === void 0 ? 32 : _ref$avatarSize,
      threadList = _ref.threadList;

  var _useContext = useContext(ChannelContext),
      channel = _useContext.channel,
      client = _useContext.client,
      thread = _useContext.thread,
      typing = _useContext.typing;

  if (!typing || !client || (channel === null || channel === void 0 ? void 0 : (_channel$getConfig = channel.getConfig()) === null || _channel$getConfig === void 0 ? void 0 : _channel$getConfig.typing_events) === false) {
    return null;
  }

  var typingInChannel = Object.values(typing).filter(function (_ref2) {
    var _client$user;

    var user = _ref2.user,
        parent_id = _ref2.parent_id;
    return (user === null || user === void 0 ? void 0 : user.id) !== ((_client$user = client.user) === null || _client$user === void 0 ? void 0 : _client$user.id) && parent_id == null;
  });
  var typingInThread = Object.values(typing).some(function (event) {
    return (event === null || event === void 0 ? void 0 : event.parent_id) === (thread === null || thread === void 0 ? void 0 : thread.id);
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "str-chat__typing-indicator ".concat(threadList && typingInThread || !threadList && typingInChannel.length ? 'str-chat__typing-indicator--typing' : '')
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__typing-indicator__avatars"
  }, typingInChannel.map(function (_ref3, i) {
    var user = _ref3.user;
    return /*#__PURE__*/React.createElement(Avatar$1, {
      image: user === null || user === void 0 ? void 0 : user.image,
      size: avatarSize,
      name: (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.id),
      key: "".concat(user === null || user === void 0 ? void 0 : user.id, "-").concat(i)
    });
  })), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__typing-indicator__dots"
  }, /*#__PURE__*/React.createElement("span", {
    className: "str-chat__typing-indicator__dot"
  }), /*#__PURE__*/React.createElement("span", {
    className: "str-chat__typing-indicator__dot"
  }), /*#__PURE__*/React.createElement("span", {
    className: "str-chat__typing-indicator__dot"
  })));
};

var DefaultTypingIndicator = /*#__PURE__*/React.memo(TypingIndicator);

function _createSuper$2(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$2(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$2() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
/**
 * MessageList - The message list components renders a list of messages. Its a consumer of [Channel Context](https://getstream.github.io/stream-chat-react/#channel)
 *
 * @example ../../docs/MessageList.md
 * @extends PureComponent
 */

var MessageList = /*#__PURE__*/function (_PureComponent) {
  _inherits(MessageList, _PureComponent);

  var _super = _createSuper$2(MessageList);

  function MessageList(props) {
    var _this;

    _classCallCheck(this, MessageList);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "scrollToBottom", function () {
      _this._scrollToRef(_this.bottomRef, _this.messageList);
    });

    _defineProperty(_assertThisInitialized(_this), "_scrollToRef", function (el, parent) {
      var scrollDown = function scrollDown() {
        if (el && el.current && parent && parent.current) {
          _this.scrollToTarget(el.current, parent.current);
        }
      };

      scrollDown(); // scroll down after images load again

      setTimeout(scrollDown, 200);
    });

    _defineProperty(_assertThisInitialized(_this), "scrollToTarget", function (target, containerEl) {
      // Moved up here for readability:
      var isElement = target && target.nodeType === 1;
      var isNumber = Object.prototype.toString.call(target) === '[object Number]';
      var scrollTop;
      if (isElement) scrollTop = target.offsetTop;else if (isNumber) scrollTop = target;else if (target === 'top') scrollTop = 0;else if (target === 'bottom') scrollTop = containerEl.scrollHeight - containerEl.offsetHeight;
      if (scrollTop !== undefined) containerEl.scrollTop = scrollTop; // eslint-disable-line no-param-reassign
    });

    _defineProperty(_assertThisInitialized(_this), "goToNewMessages", function () {
      _this.scrollToBottom();

      _this.setState({
        newMessagesNotification: false
      });
    });

    _defineProperty(_assertThisInitialized(_this), "userScrolledUp", function () {
      return _this.scrollOffset > _this.props.scrolledUpThreshold;
    });

    _defineProperty(_assertThisInitialized(_this), "listenToScroll", function (offset, reverseOffset, threshold) {
      _this.scrollOffset = offset;
      _this.closeToTop = reverseOffset < threshold;

      if (_this.state.newMessagesNotification && !_this.userScrolledUp()) {
        _this.setState({
          newMessagesNotification: false
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "addNotification", function (notificationText, type) {
      if (typeof notificationText !== 'string') return;
      if (type !== 'success' && type !== 'error') return;
      var id = v4();

      _this.setState(function (_ref) {
        var notifications = _ref.notifications;
        return {
          notifications: [].concat(_toConsumableArray(notifications), [{
            id,
            text: notificationText,
            type
          }])
        };
      }); // remove the notification after 5000 ms


      var ct = setTimeout(function () {
        return _this.setState(function (_ref2) {
          var notifications = _ref2.notifications;
          return {
            notifications: notifications.filter(function (n) {
              return n.id !== id;
            })
          };
        });
      }, 5000);

      _this.notificationTimeouts.push(ct);
    });

    _defineProperty(_assertThisInitialized(_this), "onMessageLoadCaptured", function () {
      // A load event (emitted by e.g. an <img>) was captured on a message.
      // In some cases, the loaded asset is larger than the placeholder, which means we have to scroll down.
      if (!_this.userScrolledUp() && !_this.closeToTop) {
        _this.scrollToBottom();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "loadMore", function () {
      return _this.props.messageLimit ? _this.props.loadMore(_this.props.messageLimit) : _this.props.loadMore();
    });

    _this.state = {
      newMessagesNotification: false,
      notifications: []
    };
    _this.bottomRef = /*#__PURE__*/React.createRef();
    _this.messageList = /*#__PURE__*/React.createRef();
    _this.notificationTimeouts = [];
    return _this;
  }

  _createClass(MessageList, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // start at the bottom
      this.scrollToBottom();
      var messageListRect = this.messageList.current.getBoundingClientRect();
      this.setState({
        messageListRect
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.notificationTimeouts.forEach(clearTimeout);
    }
  }, {
    key: "getSnapshotBeforeUpdate",
    value: function getSnapshotBeforeUpdate(prevProps) {
      if (this.props.threadList) {
        return null;
      } // Are we adding new items to the list?
      // Capture the scroll position so we can adjust scroll later.


      if (prevProps.messages.length < this.props.messages.length) {
        var list = this.messageList.current;
        return {
          offsetTop: list.scrollTop,
          offsetBottom: list.scrollHeight - list.scrollTop
        };
      }

      return null;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState, snapshot) {
      // If we have a snapshot value, we've just added new items.
      // Adjust scroll so these new items don't push the old ones out of view.
      // (snapshot here is the value returned from getSnapshotBeforeUpdate)
      var userScrolledUp = this.userScrolledUp();
      var currentLastMessage = this.props.messages[this.props.messages.length - 1];
      var previousLastMessage = prevProps.messages[prevProps.messages.length - 1];

      if (!previousLastMessage || !currentLastMessage) {
        return;
      }

      var hasNewMessage = currentLastMessage.id !== previousLastMessage.id;
      var isOwner = currentLastMessage.user.id === this.props.client.userID;
      var list = this.messageList.current; // always scroll down when it's your own message that you added...

      var scrollToBottom = hasNewMessage && (isOwner || !userScrolledUp);

      if (scrollToBottom) {
        this.scrollToBottom(); // remove the scroll notification if we already scrolled down...

        if (this.state.newMessagesNotification) this.setState({
          newMessagesNotification: false
        });
        return;
      }

      if (snapshot !== null) {
        // Maintain the offsetTop of scroll so that content in viewport doesn't move.
        // This is for the case where user has scroll up significantly and a new message arrives from someone.
        if (hasNewMessage) {
          this.scrollToTarget(snapshot.offsetTop, this.messageList.current);
        } else {
          // Maintain the bottomOffset of scroll.
          // This is for the case of pagination, when more messages get loaded.
          this.scrollToTarget(list.scrollHeight - snapshot.offsetBottom, this.messageList.current);
        }
      } // Check the scroll position... if you're scrolled up show a little notification


      if (hasNewMessage && !this.state.newMessagesNotification) {
        this.setState({
          newMessagesNotification: true
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var t = this.props.t;
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        className: "str-chat__list ".concat(this.props.threadList ? 'str-chat__list--thread' : ''),
        ref: this.messageList
      }, /*#__PURE__*/React.createElement(MessageListInner$1, {
        bottomRef: this.bottomRef,
        channel: this.props.channel,
        client: this.props.client,
        DateSeparator: this.props.DateSeparator || this.props.dateSeparator,
        disableDateSeparator: this.props.disableDateSeparator,
        EmptyStateIndicator: this.props.EmptyStateIndicator,
        HeaderComponent: this.props.HeaderComponent,
        headerPosition: this.props.headerPosition,
        hideDeletedMessages: this.props.hideDeletedMessages,
        messages: this.props.messages,
        MessageSystem: this.props.MessageSystem,
        noGroupByUser: this.props.noGroupByUser,
        onMessageLoadCaptured: this.onMessageLoadCaptured,
        read: this.props.read,
        threadList: this.props.threadList,
        TypingIndicator: this.props.TypingIndicator,
        internalInfiniteScrollProps: {
          hasMore: this.props.hasMore,
          isLoading: this.props.loadingMore,
          listenToScroll: this.listenToScroll,
          loadMore: this.loadMore,
          loader: /*#__PURE__*/React.createElement(Center$1, {
            key: "loadingindicator"
          }, smartRender(this.props.LoadingIndicator, {
            size: 20
          }, null))
        },
        internalMessageProps: {
          additionalMessageInputProps: this.props.additionalMessageInputProps,
          addNotification: this.addNotification,
          Attachment: this.props.Attachment,
          Avatar: this.props.Avatar,
          channel: this.props.channel,
          getFlagMessageSuccessNotification: this.props.getFlagMessageSuccessNotification,
          getFlagMessageErrorNotification: this.props.getFlagMessageErrorNotification,
          getMuteUserSuccessNotification: this.props.getMuteUserSuccessNotification,
          getMuteUserErrorNotification: this.props.getMuteUserErrorNotification,
          getPinMessageErrorNotification: this.props.getPinMessageErrorNotification,
          members: this.props.members,
          Message: this.props.Message,
          messageActions: this.props.messageActions,
          messageListRect: this.state.messageListRect,
          mutes: this.props.mutes,
          onMentionsClick: this.props.onMentionsClick,
          onUserClick: this.props.onUserClick,
          onUserHover: this.props.onUserHover,
          onMentionsHover: this.props.onMentionsHover,
          openThread: this.props.openThread,
          removeMessage: this.props.removeMessage,
          retrySendMessage: this.props.retrySendMessage,
          unsafeHTML: this.props.unsafeHTML,
          updateMessage: this.props.updateMessage,
          watchers: this.props.watchers,
          pinPermissions: this.props.pinPermissions
        }
      })), /*#__PURE__*/React.createElement("div", {
        className: "str-chat__list-notifications"
      }, this.state.notifications.map(function (notification) {
        return /*#__PURE__*/React.createElement(CustomNotification$1, {
          active: true,
          key: notification.id,
          type: notification.type
        }, notification.text);
      }), /*#__PURE__*/React.createElement(ConnectionStatus$1, null), /*#__PURE__*/React.createElement(MessageNotification$1, {
        onClick: this.goToNewMessages,
        showNotification: this.state.newMessagesNotification
      }, t('New Messages!'))));
    }
  }]);

  return MessageList;
}(PureComponent);

MessageList.propTypes = {
  /**
   * Date separator UI component to render
   *
   * Defaults to and accepts same props as: [DateSeparator](https://github.com/GetStream/stream-chat-react/blob/master/src/components/DateSeparator.js)
   * */
  dateSeparator: PropTypes.elementType,

  /** Disables the injection of date separator components, defaults to false */
  disableDateSeparator: PropTypes.bool,

  /** Hides the MessageDeleted components from the list, defaults to false */
  hideDeletedMessages: PropTypes.bool,

  /** Turn off grouping of messages by user */
  noGroupByUser: PropTypes.bool,

  /** render HTML instead of markdown. Posting HTML is only allowed server-side */
  unsafeHTML: PropTypes.bool,

  /** Set the limit to use when paginating messages */
  messageLimit: PropTypes.number,

  /**
   * Array of allowed actions on message. e.g. ['edit', 'delete', 'flag', 'mute', 'react', 'reply']
   * If all the actions need to be disabled, empty array or false should be provided as value of prop.
   * */
  messageActions: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),

  /**
   * Boolean weather current message list is a thread.
   */
  threadList: PropTypes.bool,

  /**
   * Function that returns message/text as string to be shown as notification, when request for flagging a message is successful
   *
   * This function should accept following params:
   *
   * @param message A [message object](https://getstream.io/chat/docs/#message_format) which is flagged.
   *
   * */
  getFlagMessageSuccessNotification: PropTypes.func,

  /**
   * Function that returns message/text as string to be shown as notification, when request for flagging a message runs into error
   *
   * This function should accept following params:
   *
   * @param message A [message object](https://getstream.io/chat/docs/#message_format) which is flagged.
   *
   * */
  getFlagMessageErrorNotification: PropTypes.func,

  /**
   * Function that returns message/text as string to be shown as notification, when request for muting a user is successful
   *
   * This function should accept following params:
   *
   * @param user A user object which is being muted
   *
   * */
  getMuteUserSuccessNotification: PropTypes.func,

  /**
   * Function that returns message/text as string to be shown as notification, when request for muting a user runs into error
   *
   * This function should accept following params:
   *
   * @param user A user object which is being muted
   *
   * */
  getMuteUserErrorNotification: PropTypes.func,

  /**
   * Function that returns message/text as string to be shown as notification, when request for pinning a message runs into error
   *
   * This function should accept following params:
   *
   * @param message A [message object](https://getstream.io/chat/docs/#message_format)
   *
   * */
  getPinMessageErrorNotification: PropTypes.func,

  /** **Available from [chat context](https://getstream.github.io/stream-chat-react/#chat)** */
  client: PropTypes.object,

  /** **Available from [channel context](https://getstream.github.io/stream-chat-react/#channel)** */
  Attachment: PropTypes.elementType,

  /**
   * Custom UI component to display user avatar
   *
   * Defaults to and accepts same props as: [Avatar](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Avatar/Avatar.js)
   * */
  Avatar: PropTypes.elementType,

  /** **Available from [channel context](https://getstream.github.io/stream-chat-react/#channel)** */
  Message: PropTypes.elementType,

  /**
   * Custom UI component to display system messages.
   *
   * Defaults to and accepts same props as: [EventComponent](https://github.com/GetStream/stream-chat-react/blob/master/src/components/EventComponent.js)
   */
  MessageSystem: PropTypes.elementType,

  /**
   * Typing indicator UI component to render
   *
   * Defaults to and accepts same props as: [TypingIndicator](https://github.com/GetStream/stream-chat-react/blob/master/src/components/TypingIndicator/TypingIndicator.js)
   * */
  TypingIndicator: PropTypes.elementType,

  /**
   * The UI Indicator to use when MessageList or ChannelList is empty
   * */
  EmptyStateIndicator: PropTypes.elementType,

  /**
   * Component to render at the top of the MessageList
   * */
  HeaderComponent: PropTypes.elementType,

  /**
   * Component to render at the top of the MessageList while loading new messages
   * */
  LoadingIndicator: PropTypes.elementType,

  /** **Available from [channel context](https://getstream.github.io/stream-chat-react/#channel)** */
  messages: PropTypes.array.isRequired,

  /** **Available from [channel context](https://getstream.github.io/stream-chat-react/#channel)** */
  channel:
  /** @type {PropTypes.Validator<ReturnType<import('../types').StreamChatReactClient['channel']>>} */
  PropTypes.objectOf(checkChannelPropType).isRequired,

  /** **Available from [channel context](https://getstream.github.io/stream-chat-react/#channel)** */
  updateMessage: PropTypes.func.isRequired,

  /** **Available from [channel context](https://getstream.github.io/stream-chat-react/#channel)** */
  retrySendMessage: PropTypes.func,

  /** **Available from [channel context](https://getstream.github.io/stream-chat-react/#channel)** */
  removeMessage: PropTypes.func,

  /** **Available from [channel context](https://getstream.github.io/stream-chat-react/#channel)** */
  onMentionsClick: PropTypes.func,

  /** **Available from [channel context](https://getstream.github.io/stream-chat-react/#channel)** */
  onMentionsHover: PropTypes.func,

  /** **Available from [channel context](https://getstream.github.io/stream-chat-react/#channel)** */
  onUserClick: PropTypes.func,

  /** **Available from [channel context](https://getstream.github.io/stream-chat-react/#channel)** */
  onUserHover: PropTypes.func,

  /** **Available from [channel context](https://getstream.github.io/stream-chat-react/#channel)** */
  openThread: PropTypes.func,

  /** **Available from [channel context](https://getstream.github.io/stream-chat-react/#channel)** */
  members: PropTypes.object,

  /** **Available from [channel context](https://getstream.github.io/stream-chat-react/#channel)** */
  watchers: PropTypes.object,

  /** **Available from [channel context](https://getstream.github.io/stream-chat-react/#channel)** */
  read: PropTypes.object,

  /**
   * Additional props for underlying MessageInput component. We have instance of MessageInput
   * component in MessageSimple component, for handling edit state.
   * Available props - https://getstream.github.io/stream-chat-react/#messageinput
   * */
  additionalMessageInputProps: PropTypes.object,

  /**
   * The user roles allowed to pin messages in various channel types
   */
  pinPermissions:
  /** @type {PropTypes.Validator<import('../types').PinPermissions>>} */
  PropTypes.object,

  /** The pixel threshold to determine whether or not the user is scrolled up in the list */
  scrolledUpThreshold: PropTypes.number
};
MessageList.defaultProps = {
  Attachment,
  Avatar,
  Message: MessageSimple$1,
  MessageSystem: EventComponent$1,
  threadList: false,
  DateSeparator: DefaultDateSeparator,
  LoadingIndicator: DefaultLoadingIndicator,
  TypingIndicator: DefaultTypingIndicator,
  EmptyStateIndicator: DefaultEmptyStateIndicator,
  unsafeHTML: false,
  noGroupByUser: false,
  messageActions: Object.keys(MESSAGE_ACTIONS),
  pinPermissions: defaultPinPermissions,
  scrolledUpThreshold: 200
};
var MessageList$1 = withTranslationContext(function (props) {
  return /*#__PURE__*/React.createElement(ChannelContext.Consumer, null, function (_ref3) {
    var typing = _ref3.typing,
        channelContext = _objectWithoutProperties(_ref3, ["typing"]);

    return /*#__PURE__*/React.createElement(MessageList, _extends({}, channelContext, props));
  });
});

/**
 * @param {import('../types').VirtualizedMessageListInternalProps['messages']} messages
 * @param {string | undefined} currentUserId
 */

function useNewMessageNotification(messages, currentUserId) {
  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      newMessagesNotification = _useState2[0],
      setNewMessagesNotification = _useState2[1];

  var lastMessageId = useRef('');
  var atBottom = useRef(false);
  useEffect(function () {
    var _lastMessage$user;

    /* handle scrolling behavior for new messages */
    if (!(messages !== null && messages !== void 0 && messages.length)) return;
    var lastMessage = messages[messages.length - 1];
    var prevMessageId = lastMessageId.current;
    lastMessageId.current = lastMessage.id || ''; // update last message id

    /* do nothing if new messages are loaded from top(loadMore)  */

    if (lastMessage.id === prevMessageId) return;
    /* if list is already at the bottom return, followOutput will do the job */

    if (atBottom.current) return;
    /* if the new message belongs to current user scroll to bottom */

    if (((_lastMessage$user = lastMessage.user) === null || _lastMessage$user === void 0 ? void 0 : _lastMessage$user.id) !== currentUserId) {
      /* otherwise just show newMessage notification  */
      setNewMessagesNotification(true);
    }
  }, [currentUserId, messages]);
  return {
    atBottom,
    setNewMessagesNotification,
    newMessagesNotification
  };
}

// @ts-check
/**
 * @param {Array<{ id: string }> | undefined} messages,
 */

var usePrependedMessagesCount = function usePrependedMessagesCount(messages) {
  var _messages$;

  var currentFirstMessageId = messages === null || messages === void 0 ? void 0 : (_messages$ = messages[0]) === null || _messages$ === void 0 ? void 0 : _messages$.id;
  var firstMessageId = useRef(currentFirstMessageId);
  var earliestMessageId = useRef(currentFirstMessageId);
  var previousNumItemsPrepended = useRef(0);
  var numItemsPrepended = useMemo(function () {
    if (!messages || !messages.length) {
      return 0;
    } // if no new messages were prepended, return early (same amount as before)


    if (currentFirstMessageId === earliestMessageId.current) {
      return previousNumItemsPrepended.current;
    }

    if (!firstMessageId.current) {
      firstMessageId.current = currentFirstMessageId;
    }

    earliestMessageId.current = currentFirstMessageId; // if new messages were prepended, find out how many
    // start with this number because there cannot be fewer prepended items than before

    for (var i = previousNumItemsPrepended.current; i < messages.length; i += 1) {
      if (messages[i].id === firstMessageId.current) {
        previousNumItemsPrepended.current = i;
        return i;
      }
    }

    return 0; // TODO: there's a bug here, the messages prop is the same array instance (something mutates it)
    // that's why the second dependency is necessary
  }, [messages, messages === null || messages === void 0 ? void 0 : messages.length]);
  return numItemsPrepended;
};

/**
 * @param {import('../types').VirtualizedMessageListInternalProps['messages']} messages
 * @param {string | undefined} currentUserId
 */

function useShouldForceScrollToBottom(messages, currentUserId) {
  var lastFocusedOwnMessage = useRef('');
  var initialFocusRegistered = useRef(false);

  function recheckForNewOwnMessage() {
    if (messages && messages.length > 0) {
      var _lastMessage$user;

      var lastMessage = messages[messages.length - 1];

      if (((_lastMessage$user = lastMessage.user) === null || _lastMessage$user === void 0 ? void 0 : _lastMessage$user.id) === currentUserId && lastFocusedOwnMessage.current !== lastMessage.id) {
        lastFocusedOwnMessage.current = lastMessage.id;
        return true;
      }
    }

    return false;
  }

  useEffect(function () {
    if (messages && messages.length && !initialFocusRegistered.current) {
      initialFocusRegistered.current = true;
      recheckForNewOwnMessage();
    }
  }, [messages, messages === null || messages === void 0 ? void 0 : messages.length]);
  return recheckForNewOwnMessage;
}

var PREPEND_OFFSET = Math.pow(10, 7);
/**
 * VirtualizedMessageList - This component renders a list of messages in a virtual list. Its a consumer of [Channel Context](https://getstream.github.io/stream-chat-react/#channel)
 * @example ../../docs/VirtualizedMessageList.md
 * @type {React.FC<import('../types').VirtualizedMessageListInternalProps>}
 */

var VirtualizedMessageList = function VirtualizedMessageList(_ref) {
  var client = _ref.client,
      messages = _ref.messages,
      loadMore = _ref.loadMore,
      hasMore = _ref.hasMore,
      loadingMore = _ref.loadingMore,
      _ref$messageLimit = _ref.messageLimit,
      messageLimit = _ref$messageLimit === void 0 ? 100 : _ref$messageLimit,
      _ref$overscan = _ref.overscan,
      overscan = _ref$overscan === void 0 ? 0 : _ref$overscan,
      _ref$shouldGroupByUse = _ref.shouldGroupByUser,
      shouldGroupByUser = _ref$shouldGroupByUse === void 0 ? false : _ref$shouldGroupByUse,
      customMessageRenderer = _ref.customMessageRenderer,
      scrollSeekPlaceHolder = _ref.scrollSeekPlaceHolder,
      _ref$Message = _ref.Message,
      Message = _ref$Message === void 0 ? DefaultMessage : _ref$Message,
      _ref$MessageSystem = _ref.MessageSystem,
      MessageSystem = _ref$MessageSystem === void 0 ? EventComponent$1 : _ref$MessageSystem,
      _ref$MessageDeleted = _ref.MessageDeleted,
      MessageDeleted$1 = _ref$MessageDeleted === void 0 ? MessageDeleted : _ref$MessageDeleted,
      _ref$TypingIndicator = _ref.TypingIndicator,
      TypingIndicator = _ref$TypingIndicator === void 0 ? null : _ref$TypingIndicator,
      _ref$LoadingIndicator = _ref.LoadingIndicator,
      LoadingIndicator = _ref$LoadingIndicator === void 0 ? DefaultLoadingIndicator : _ref$LoadingIndicator,
      _ref$EmptyStateIndica = _ref.EmptyStateIndicator,
      EmptyStateIndicator = _ref$EmptyStateIndica === void 0 ? DefaultEmptyStateIndicator : _ref$EmptyStateIndica,
      _ref$stickToBottomScr = _ref.stickToBottomScrollBehavior,
      stickToBottomScrollBehavior = _ref$stickToBottomScr === void 0 ? 'smooth' : _ref$stickToBottomScr;

  var _useContext = useContext(TranslationContext),
      t = _useContext.t;

  var virtuoso = useRef(
  /** @type {import('react-virtuoso').VirtuosoHandle | undefined} */
  undefined);

  var _useNewMessageNotific = useNewMessageNotification(messages, client.userID),
      atBottom = _useNewMessageNotific.atBottom,
      setNewMessagesNotification = _useNewMessageNotific.setNewMessagesNotification,
      newMessagesNotification = _useNewMessageNotific.newMessagesNotification;

  var numItemsPrepended = usePrependedMessagesCount(messages);
  var shouldForceScrollToBottom = useShouldForceScrollToBottom(messages, client.userID);
  var messageRenderer = useCallback(function (messageList, virtuosoIndex) {
    var streamMessageIndex = virtuosoIndex + numItemsPrepended - PREPEND_OFFSET; // use custom renderer supplied by client if present and skip the rest

    if (customMessageRenderer) {
      return customMessageRenderer(messageList, streamMessageIndex);
    }

    var message = messageList[streamMessageIndex];
    if (!message) return /*#__PURE__*/React.createElement("div", {
      style: {
        height: '1px'
      }
    }); // returning null or zero height breaks the virtuoso

    if (message.type === 'channel.event' || message.type === 'system') {
      return /*#__PURE__*/React.createElement(MessageSystem, {
        message: message
      });
    }

    if (message.deleted_at) {
      return smartRender(MessageDeleted$1, {
        message
      }, null);
    }

    return /*#__PURE__*/React.createElement(Message, {
      message: message,
      groupedByUser: shouldGroupByUser && streamMessageIndex > 0 && message.user.id === messageList[streamMessageIndex - 1].user.id
    });
  }, [MessageDeleted$1, customMessageRenderer, shouldGroupByUser, numItemsPrepended]);
  var virtuosoComponents = useMemo(function () {
    var EmptyPlaceholder = function EmptyPlaceholder() {
      return /*#__PURE__*/React.createElement(EmptyStateIndicator, {
        listType: "message"
      });
    };

    var Header = function Header() {
      return loadingMore ? /*#__PURE__*/React.createElement("div", {
        className: "str-chat__virtual-list__loading"
      }, /*#__PURE__*/React.createElement(LoadingIndicator, {
        size: 20
      })) : /*#__PURE__*/React.createElement(React.Fragment, null);
    };
    /**
     * using 'display: inline-block' traps CSS margins of the item elements, preventing incorrect item measurements.
     * @type {import('react-virtuoso').Components['Item']}
     */


    var Item = function Item(props) {
      return /*#__PURE__*/React.createElement("div", _extends({}, props, {
        className: "str-chat__virtual-list-message-wrapper"
      }));
    };

    var Footer = function Footer() {
      return TypingIndicator ? /*#__PURE__*/React.createElement(TypingIndicator, {
        avatarSize: 24
      }) : /*#__PURE__*/React.createElement(React.Fragment, null);
    };

    return {
      EmptyPlaceholder,
      Header,
      Footer,
      Item
    };
  }, [EmptyStateIndicator, loadingMore, TypingIndicator]);

  if (!messages) {
    return null;
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "str-chat__virtual-list"
  }, /*#__PURE__*/React.createElement(Virtuoso // @ts-expect-error
  , _extends({
    ref: virtuoso,
    totalCount: messages.length,
    overscan: overscan,
    style: {
      overflowX: 'hidden'
    },
    followOutput: function followOutput(isAtBottom) {
      if (shouldForceScrollToBottom()) {
        return isAtBottom ? stickToBottomScrollBehavior : 'auto';
      } // a message from another user has been received - don't scroll to bottom unless already there


      return isAtBottom ? stickToBottomScrollBehavior : false;
    },
    itemContent: function itemContent(i) {
      return messageRenderer(messages, i);
    },
    components: virtuosoComponents,
    firstItemIndex: PREPEND_OFFSET - numItemsPrepended,
    startReached: function startReached() {
      if (hasMore) {
        loadMore(messageLimit);
      }
    },
    initialTopMostItemIndex: messages && messages.length > 0 ? messages.length - 1 : 0,
    atBottomStateChange: function atBottomStateChange(isAtBottom) {
      atBottom.current = isAtBottom;

      if (isAtBottom && newMessagesNotification) {
        setNewMessagesNotification(false);
      }
    }
  }, scrollSeekPlaceHolder ? {
    scrollSeek: scrollSeekPlaceHolder
  } : {})), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__list-notifications"
  }, /*#__PURE__*/React.createElement(MessageNotification$1, {
    showNotification: newMessagesNotification,
    onClick: function onClick() {
      if (virtuoso.current) {
        virtuoso.current.scrollToIndex(messages.length - 1);
      }

      setNewMessagesNotification(false);
    }
  }, t('New Messages!'))));
}; // TODO: fix the types here when everything converted to proper TS

/**
 * @param {import("types").VirtualizedMessageListProps} props
 * @returns {React.ElementType<import("types").VirtualizedMessageListInternalProps>}
 */


function VirtualizedMessageListWithContext(props) {
  // @ts-expect-error
  return /*#__PURE__*/React.createElement(ChannelContext.Consumer, null, function (
  /* {Required<Pick<import('../types').ChannelContextValue, 'client' | 'messages' | 'loadMore' | 'hasMore'>>} */
  context) {
    return /*#__PURE__*/React.createElement(VirtualizedMessageList, _extends({
      client: context.client,
      messages: context.messages // @ts-expect-error
      ,
      loadMore: context.loadMore // @ts-expect-error
      ,
      hasMore: context.hasMore // @ts-expect-error
      ,
      loadingMore: context.loadingMore
    }, props));
  });
}

function ownKeys$c(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$c(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$c(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$c(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
/**
 * Thread - The Thread renders a parent message with a list of replies. Use the standard message list of the main channel's messages.
 * The thread is only used for the list of replies to a message.
 * Underlying MessageList, MessageInput and Message components can be customized using props:
 * - additionalParentMessageProps
 * - additionalMessageListProps
 * - additionalMessageInputProps
 *
 * @example ../../docs/Thread.md
 * @typedef {import('../types').ThreadProps} ThreadProps
 * @type { React.FC<ThreadProps>}
 */

var Thread$7 = function Thread(props) {
  var _channel$getConfig, _channel$getConfig$ca;

  var _useContext = useContext(ChannelContext),
      channel = _useContext.channel,
      thread = _useContext.thread;

  if (!thread || (channel === null || channel === void 0 ? void 0 : (_channel$getConfig = channel.getConfig) === null || _channel$getConfig === void 0 ? void 0 : (_channel$getConfig$ca = _channel$getConfig.call(channel)) === null || _channel$getConfig$ca === void 0 ? void 0 : _channel$getConfig$ca.replies) === false) return null; // The wrapper ensures a key variable is set and the component recreates on thread switch

  return /*#__PURE__*/React.createElement(ThreadInner, _extends({}, props, {
    key: "thread-".concat(thread.id, "-").concat(channel === null || channel === void 0 ? void 0 : channel.cid)
  }));
};

Thread$7.propTypes = {
  /**
   * Additional props for underlying MessageInput component.
   * Available props - https://getstream.github.io/stream-chat-react/#messageinput
   * */
  additionalMessageInputProps: PropTypes.object,

  /**
   * Additional props for underlying MessageList component.
   * Available props - https://getstream.github.io/stream-chat-react/#messagelist
   * */
  additionalMessageListProps: PropTypes.object,

  /**
   * Additional props for underlying Message component of parent message at the top.
   * Available props - https://getstream.github.io/stream-chat-react/#message
   * */
  additionalParentMessageProps: PropTypes.object,

  /** Make input focus on mounting thread */
  autoFocus: PropTypes.bool,

  /** Display the thread on 100% width of it's container. Useful for mobile style view */
  fullWidth: PropTypes.bool,

  /** UI component to override the default Message stored in channel context */
  Message:
  /** @type {PropTypes.Validator<React.ComponentType<import('../types').MessageUIComponentProps>>} */
  PropTypes.elementType,

  /** Customized MessageInput component to used within Thread instead of default MessageInput
      Useable as follows:
      ```
      <Thread MessageInput={(props) => <MessageInput parent={props.parent} Input={MessageInputSmall} /> }/>
      ```
  */
  MessageInput:
  /** @type {PropTypes.Validator<React.ComponentType<import('../types').MessageInputProps>>} */
  PropTypes.elementType,

  /** UI component used to override the default header of the thread */
  ThreadHeader:
  /** @type {PropTypes.Validator<React.ComponentType<import('../types').ThreadHeaderProps>>} */
  PropTypes.elementType
};
Thread$7.defaultProps = {
  fullWidth: false,
  autoFocus: true,
  MessageInput: MessageInput$1
};
/**
 * @type { React.FC<import('../types').ThreadHeaderProps> }
 */

var DefaultThreadHeader = function DefaultThreadHeader(_ref) {
  var closeThread = _ref.closeThread,
      t = _ref.t,
      thread = _ref.thread;

  var getReplyCount = function getReplyCount() {
    if (!(thread !== null && thread !== void 0 && thread.reply_count) || !t) return '';
    if (thread.reply_count === 1) return t('1 reply');
    return t('{{ replyCount }} replies', {
      replyCount: thread.reply_count
    });
  };

  return /*#__PURE__*/React.createElement("div", {
    className: "str-chat__thread-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-chat__thread-header-details"
  }, /*#__PURE__*/React.createElement("strong", null, t && t('Thread')), /*#__PURE__*/React.createElement("small", null, getReplyCount())), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick(e) {
      return closeThread && closeThread(e);
    },
    className: "str-chat__square-button",
    "data-testid": "close-button"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "10",
    height: "10",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9.916 1.027L8.973.084 5 4.058 1.027.084l-.943.943L4.058 5 .084 8.973l.943.943L5 5.942l3.973 3.974.943-.943L5.942 5z",
    fillRule: "evenodd"
  }))));
};
/**
 * @typedef {import('../types').ThreadProps & {key: string}} ThreadInnerProps
 * @type { React.FC<ThreadInnerProps>}
 */


var ThreadInner = function ThreadInner(props) {
  var additionalMessageInputProps = props.additionalMessageInputProps,
      additionalMessageListProps = props.additionalMessageListProps,
      additionalParentMessageProps = props.additionalParentMessageProps,
      autoFocus = props.autoFocus,
      fullWidth = props.fullWidth,
      PropMessage = props.Message,
      ThreadMessageInput = props.MessageInput,
      _props$ThreadHeader = props.ThreadHeader,
      ThreadHeader = _props$ThreadHeader === void 0 ? DefaultThreadHeader : _props$ThreadHeader;

  var _useContext2 = useContext(ChannelContext),
      channel = _useContext2.channel,
      closeThread = _useContext2.closeThread,
      loadMoreThread = _useContext2.loadMoreThread,
      ContextMessage = _useContext2.Message,
      thread = _useContext2.thread,
      threadHasMore = _useContext2.threadHasMore,
      threadLoadingMore = _useContext2.threadLoadingMore,
      threadMessages = _useContext2.threadMessages;

  var _useContext3 = useContext(ChatContext),
      client = _useContext3.client;

  var _useContext4 = useContext(TranslationContext),
      t = _useContext4.t;

  var messageList = useRef(
  /** @type {HTMLDivElement | null} */
  null);
  var parentID = thread === null || thread === void 0 ? void 0 : thread.id;
  var ThreadMessage = PropMessage || ContextMessage;
  useEffect(function () {
    if (parentID && thread !== null && thread !== void 0 && thread.reply_count && loadMoreThread) {
      loadMoreThread();
    }
  }, []); // eslint-disable-line

  useEffect(function () {
    if (messageList.current && threadMessages !== null && threadMessages !== void 0 && threadMessages.length) {
      var _messageList$current = messageList.current,
          clientHeight = _messageList$current.clientHeight,
          scrollTop = _messageList$current.scrollTop,
          scrollHeight = _messageList$current.scrollHeight;
      var scrollDown = clientHeight + scrollTop !== scrollHeight;

      if (scrollDown) {
        messageList.current.scrollTop = scrollHeight - clientHeight;
      }
    }
  }, [threadMessages === null || threadMessages === void 0 ? void 0 : threadMessages.length]);
  if (!thread) return null;
  var read = {};
  return /*#__PURE__*/React.createElement("div", {
    className: "str-chat__thread ".concat(fullWidth ? 'str-chat__thread--full' : '')
  }, /*#__PURE__*/React.createElement(ThreadHeader, {
    closeThread: closeThread,
    t: t,
    thread: thread
  }), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__thread-list",
    ref: messageList
  }, /*#__PURE__*/React.createElement(Message$1, _extends({
    channel: channel,
    client: client,
    initialMessage: true,
    message: thread,
    Message: ThreadMessage,
    threadList: true
  }, additionalParentMessageProps)), /*#__PURE__*/React.createElement("div", {
    className: "str-chat__thread-start"
  }, t && t('Start of a new thread')), /*#__PURE__*/React.createElement(MessageList$1, _extends({
    hasMore: threadHasMore,
    loadMore: loadMoreThread,
    loadingMore: threadLoadingMore,
    messages: threadMessages,
    Message: ThreadMessage,
    read: read,
    threadList: true
  }, additionalMessageListProps))), smartRender(ThreadMessageInput, _objectSpread$c({
    Input: MessageInputSmall,
    parent: thread,
    focus: autoFocus,
    publishTypingEvent: false
  }, additionalMessageInputProps)));
};

// @ts-check
/**
 * Window - A UI component for conditionally displaying thread or channel.
 *
 * @example ../../docs/Window.md
 * @type { React.FC<import('../types').WindowProps>}
 */

var Window = function Window(_ref) {
  var children = _ref.children,
      _ref$hideOnThread = _ref.hideOnThread,
      hideOnThread = _ref$hideOnThread === void 0 ? false : _ref$hideOnThread;

  var _useContext = useContext(ChannelContext),
      thread = _useContext.thread; // If thread is active and window should hide on thread. Return null


  if (thread && hideOnThread) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "str-chat__main-panel"
  }, children);
};

Window.propTypes = {
  /** show or hide the window when a thread is active */
  hideOnThread: PropTypes.bool
};
var Window$1 = /*#__PURE__*/React.memo(Window);

export { Attachment, DefaultAttachmentActions as AttachmentActions, DefaultAudio as Audio, ReactTextareaAutocomplete as AutoCompleteTextarea, Avatar, DefaultCard as Card, Channel$1 as Channel, ChannelContext, ChannelHeader$1 as ChannelHeader, ChannelList$1 as ChannelList, ChannelListMessenger, ChannelListTeam, ChannelPreview, ChannelPreviewCompact$1 as ChannelPreviewCompact, ChannelPreviewCountOnly$1 as ChannelPreviewCountOnly, ChannelPreviewLastMessage$1 as ChannelPreviewLastMessage, ChannelPreviewMessenger$1 as ChannelPreviewMessenger, ChannelSearch$1 as ChannelSearch, Chat, ChatAutoComplete$1 as ChatAutoComplete, ChatContext, ChatDown$1 as ChatDown, CommandItem$1 as CommandItem, ConnectionStatus$1 as ConnectionStatus, DefaultDateSeparator as DateSeparator, EditMessageForm, EmojiPicker, EmoticonItem$1 as EmoticonItem, DefaultEmptyStateIndicator as EmptyStateIndicator, EventComponent$1 as EventComponent, DefaultFile as FileAttachment, DefaultMessage as FixedHeightMessage, Gallery$1 as Gallery, ImageComponent, InfiniteScroll, InfiniteScrollPaginator, Item, KEY_CODES, List, DefaultLoadMoreButton as LoadMoreButton, LoadMorePaginator$1 as LoadMorePaginator, LoadingChannels$1 as LoadingChannels, DefaultLoadingErrorIndicator as LoadingErrorIndicator, DefaultLoadingIndicator as LoadingIndicator, MESSAGE_ACTIONS, Message$1 as Message, MessageActions, MessageActionsBox$1 as MessageActionsBox, MessageCommerce$1 as MessageCommerce, MessageDeleted, MessageInput$1 as MessageInput, MessageInputFlat, MessageInputLarge, MessageInputSimple, MessageInputSmall, MessageList$1 as MessageList, MessageLivestream, MessageNotification$1 as MessageNotification, MessageOptions, MessagePropTypes, MessageRepliesCountButton$1 as MessageRepliesCountButton, MessageSimple$1 as MessageSimple, MessageTeam$1 as MessageTeam, MessageText, Modal, ModalImage, ModalComponent as ModalWrapper, DefaultReactionSelector as ReactionSelector, DefaultReactionsList as ReactionsList, ReverseInfiniteScroll, SafeAnchor$1 as SafeAnchor, SendButton, DefaultReactionsList$1 as SimpleReactionsList, Streami18n, Thread$7 as Thread, Tooltip$1 as Tooltip, TranslationContext, DefaultTypingIndicator as TypingIndicator, UploadsPreview, UserItem$1 as UserItem, VirtualizedMessageListWithContext as VirtualizedMessageList, Window$1 as Window, areMessagePropsEqual, byDate, checkChannelPropType, checkClientPropType, defaultPinPermissions, defaultScrollToItem, enTranslations, frTranslations, generateRandomId, getDisplayImage, getDisplayTitle, getImages, getLatestMessagePreview, getMessageActions, getNonImageAttachments, getReadByTooltipText, handleActionWarning, hiTranslations, isOnlyEmojis, isPromise, isUserMuted, itTranslations, Listeners as listener, messageHasAttachments, messageHasReactions, missingUseFlagHandlerParameterWarning, missingUseMuteHandlerParamsWarning, nlTranslations, reactionHandlerWarning, renderText, ruTranslations, shouldMessageComponentUpdate, smartRender, trTranslations, truncate, useActionHandler, useBreakpoint, useEditMessageHandler as useChannelEditMessageHandler, useMentionsHandlers as useChannelMentionsHandler, useDeleteHandler, useEditHandler, useFlagHandler, useMentionsHandler, useMentionsUIHandler, useMessageInput, useMobilePress, useMuteHandler, useOpenThreadHandler, usePinHandler, useReactionClick, useReactionHandler, useRetryHandler, useUserHandler, useUserRole, validateAndGetMessage, withChannelContext, withChatContext, withTranslationContext };
//# sourceMappingURL=index.es.js.map
