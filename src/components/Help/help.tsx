const Help = () => {
    return(
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Help & Support</h1>
            <p className="mb-4">
                If you need assistance with the Skoda Self-Leaning Kit, please refer to the following resources:
            </p>
            <ul className="list-disc list-inside mb-4">
                <li><a href="/user-guide" className="text-blue-500 hover:underline">User Guide</a> - Step-by-step instructions on how to use the kit.</li>
                <li><a href="/faq" className="text-blue-500 hover:underline">FAQ</a> - Frequently Asked Questions about the kit.</li>
                <li><a href="/contact-support" className="text-blue-500 hover:underline">Contact Support</a> - Get in touch with our support team for personalized assistance.</li>
            </ul>
            <p>
                We are here to help you make the most out of your Skoda Self-Leaning Kit. Don't hesitate to reach out if you have any questions or need further assistance!
            </p>
        </div>  
    )
}

export default Help;