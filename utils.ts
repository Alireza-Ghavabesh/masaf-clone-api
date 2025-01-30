export function getNestjsServerAdress(): string {
    return `${process.env.NEXT_PUBLIC_HTTPS_RESTAPI_ADDRESS !== "" ? process.env.NEXT_PUBLIC_HTTPS_RESTAPI_ADDRESS : process.env.NEXT_PUBLIC_HTTP_RESTAPI_ADDRESS}`
  }
  
export function getNextjsServerAdress(): string {
    return `${process.env.NEXT_PUBLIC_HTTPS_DOMAIN_ADDRESS !== "" ? process.env.NEXT_PUBLIC_HTTPS_DOMAIN_ADDRESS : process.env.NEXT_PUBLIC_HTTP_DOMAIN_ADDRESS}`
}