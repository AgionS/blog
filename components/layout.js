import Head from "next/head"
import styles from "./layout.module.css"
import utilStyles from "../styles/utils.module.css"
import Link from "next/link"

const name = "前端文章"
export const siteTitle = "agions 个人文章"

export default function Layout({ children, home }) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel='icon' href='/favicon.ico' />
        <meta name='description' content='个人文章，技术文章' />
        <meta
          name='viewport'
          content='width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no'
        />
        <meta name='og:title' content={siteTitle} />
        <meta name='twitter:card' content='summary_large_image' />
      </Head>
      <header className={styles.header}>
        {home && (
          <>
            <h1 className={utilStyles.heading2Xl}>{name}</h1>
          </>
        )}
      </header>
      <main>{children}</main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href='/'>
            <a>←首页</a>
          </Link>
        </div>
      )}
    </div>
  )
}
