export default function page() {
    return (
        <div className='w-screen h-screen bg-black flex justify-center items-center flex-col'>
            <img className='w-50 h-auto' src='./notfound.png' alt="notFoundVector" />
            <h1 className='mt-4 font-sans text-4xl text-white'>Wrong Link Address ! </h1>
            <h2 className='mt-4 font-sans text-4xl text-white'>Please check the link provided</h2>
        </div>
    );
}