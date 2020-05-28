const metadata = {
  title: 'y_nk',
  subtitle: '',
  rights: '',
  url: 'https://y-nk.github.io/blog/',
  logo: '',
  icon: '',

  author: 'Julien Barbay',
  email: 'julien.barbay@gmail.com',
  uri: 'https://twitter.com/y_nk',

  categories: [],
}

const head = (document, data) => {
  document.title = 'y_nk'

  if (!data)
    return
  
  const meta = (name, content) => {
    const meta = document.createElement('meta')
    meta.setAttribute('property', name)
    meta.setAttribute('content', content)
    document.head.appendChild(meta)
  }

  meta('og:type', 'article')
  meta('article:author', document.querySelector('head > meta[name="author"]').getAttribute('content'))

  if ('title' in data) {
    document.title += ` – ${data.title}`
    meta('og:title', data.title)
  }

  if ('description' in data)
    ['description', 'og:description']
      .forEach(prop => meta(prop, data.description))

  if ('link' in data)
    meta('og:url', data.link)

  if ('timestamp' in data)
    meta('article:published_time', data.timestamp)

  if ('tags' in data)
    meta('article:tag', data.tags)
}

const index = posts => {
  const sorted = posts
    .sort((a, b) => b.timestamp - a.timestamp)
    .map(meta => post(meta))
    .join('')

  return `<ul class="posts">${sorted}</ul>`
}

const title = ({ title, timestamp }) => (`
  <hgroup>
    <h2>${title}</h2>
    <h6>${date(timestamp)}</h6>
  </hgroup>
`)

const post = ({ title, description, timestamp, link }) => (`<li class="post">
  <h2>
    <time>${date(timestamp)}</time>
    <a href="${link}">${ title }</a>
  </h2>
  <p>${description}</p>
</li>`)

const date = timestamp => {
  const months = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"]

  const date = new Date(timestamp)

  const day = date.getDate()
  const suffix = (day % 10 == 1 && day != 11)
    ? "st" : (day % 10 == 2 && day != 12)
    ? "nd" : (day % 10 == 3 && day != 13)
    ? "rd" : "th"

  const month = months[date.getMonth()]
  const year = date.getFullYear()

  return `${month} ${day}${suffix}, ${year}`
}

module.exports = { metadata, head, index, title }