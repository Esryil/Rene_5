export const metadata = {
    title : "Frontend con nextjs",
    description : "Frontend"
}
export default function RootLayout({children}){
    return(
        <html>
            <body>
                {children}
            </body>
        </html>
    );
}