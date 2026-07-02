export default function ShanghaiFoodRedirect() {
  return null
}

export function getServerSideProps() {
  return {
    redirect: {
      destination: '/food',
      permanent: true
    }
  }
}
