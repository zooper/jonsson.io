import B2 from 'backblaze-b2';

async function testB2Connection() {
    try {
        console.log('Testing B2 connection with .env credentials...');
        
        // Use exact credentials from .env file
        const b2 = new B2({
            applicationKeyId: '001ed8b9e4334cf000000001d',
            applicationKey: 'K001xupBl2zRMXfUsKujwCs/0sA5dkk'
        });
        console.log('B2 instance created');
        
        // Test authorization
        const authResponse = await b2.authorize();
        console.log('Authorization successful:', authResponse.data);
        
        // Test getting upload URL with exact bucket ID from .env
        const uploadUrl = await b2.getUploadUrl({
            bucketId: '2eede8aba95e44a373e40c1f'
        });
        console.log('Upload URL obtained:', uploadUrl.data);
        
    } catch (error) {
        console.error('B2 test failed:', error);
        console.error('Error details:', error.response?.data);
        console.error('Error status:', error.response?.status);
    }
}

testB2Connection();