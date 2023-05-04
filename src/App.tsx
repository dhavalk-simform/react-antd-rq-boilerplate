import { useState, Fragment } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { ConfigProvider } from 'antd'
import { useQuery } from 'react-query'

import { getAntTheme, getColor, getComponent } from './config/ThemeVariable'
import { Button } from './components/Ant'
import useColorConfig from './config/useColorConfig'
import GlobalStyle from './config/global.style'
import viteLogo from '/vite.svg'
import reactLogo from './assets/images/react.svg'
import Home from './pages/Home'
import Contact from './pages/Contact'
import About from './pages/About'
import NotFound from './pages/NotFound'
import Layout from './components/layout/Layout'
import { ThemeContextProvider } from './context/ThemeContext'
import axiosInstance from './utils/api'

export interface User {
  id: number
  name: string
  username: string
  email: string
  address: Address
  phone: string
  website: string
  company: Company
}
export interface Address {
  street: string
  suite: string
  city: string
  zipcode: string
  geo: Geo
}
export interface Geo {
  lat: string
  lng: string
}
export interface Company {
  name: string
  catchPhrase: string
  bs: string
}

function App() {
  const [count, setCount] = useState(0)
  const [themeColor, handleChange] = useColorConfig()

  // eslint-disable-next-line consistent-return
  async function fetchNotes() {
    try {
      const response = await axiosInstance.get('/users', {
        withoutAuth: true
      })

      return response.data
    } catch (e) {
      if (e instanceof Error) {
        // you can create util functon to handle errors.
        // console.log(e.message)
      }
    }
  }

  // const { isLoading, isError, data } = useQuery(['notes'], fetchNotes)
  const { data } = useQuery(['notes'], fetchNotes)

  // {
  //   isLoading && <p>Loading react-query API response....</p>
  // }
  // {
  //   isError && <p>error while fetching react-query API response....</p>
  // }

  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        {
          path: '/',
          index: true,
          element: <Home />
        },
        {
          path: '/contact',
          element: <Contact />
        },
        {
          path: '/about',
          element: <About />
        },
        {
          path: '*',
          element: <NotFound />
        }
      ]
    }
  ])

  return (
    <ThemeContextProvider value={[themeColor, handleChange]}>
      <ConfigProvider
        theme={{
          token: getAntTheme(themeColor),
          components: getComponent(themeColor)
        }}
      >
        <ThemeProvider theme={getColor(themeColor)}>
          <GlobalStyle />
          <RouterProvider router={router} />
          {/*
            below code should not be part of App.tsx file
            for this boilerplate I've put all this code in this file.
            this file should have only route provide. theme provider
            and global features only.

            When you start working on project move/remove below code
            and related code to different file.
            */}
          <div style={{ display: 'flex' }}>
            <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
              <img
                style={{ width: 100, height: 100 }}
                src={viteLogo}
                className="logo"
                alt="Vite logo"
              />
            </a>
            <a href="https://react.dev" target="_blank" rel="noreferrer">
              <img
                style={{ width: 100, height: 100 }}
                src={reactLogo}
                className="logo react"
                alt="React logo"
              />
            </a>
          </div>
          <p style={{ fontWeight: 500, letterSpacing: '1px' }}>
            Vite + Ant Design + Styled Components + React Query
          </p>
          <div className="card">
            <Button
              type="primary"
              htmlType="button"
              onClick={() => setCount((count) => count + 1)}
            >
              count is {count}
            </Button>
          </div>
          <div style={{ display: 'flex' }}>
            {data?.map((user: User) => {
              return (
                <Fragment key={user.id}>
                  <Button type="dashed">{user.name}</Button>
                </Fragment>
              )
            })}
          </div>
        </ThemeProvider>
      </ConfigProvider>
    </ThemeContextProvider>
  )
}

export default App
