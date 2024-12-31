# Client side data caching using indexed db in angular app

Caching plays a vital role in enhancing the performance of web applications. When it comes to client-side data caching, one of the main concerns is the size of the data to be stored. For smaller datasets, solutions like LocalStorage are often sufficient due to their simplicity and ease of use. However, LocalStorage has limited capacity (typically around 5MB), making it less suitable for larger datasets. In such cases, IndexedDB becomes a better alternative. IndexedDB supports storing much larger volumes of data—up to 10GB or 50% of the client’s disk space, depending on the browser and device. This makes it ideal for caching large datasets. IndexedDB is a more robust, asynchronous, and transactional storage solution, offering greater flexibility in managing complex data types and enabling faster access to large datasets on the client side. Here's how we can leverage IndexedDB for caching data in an Angular application  or any modern frontend stack. 

## in this code created seperate service to handle all indexed db write and get data 
you can find stored data as below.
![image](https://github.com/user-attachments/assets/102ed289-7092-40ce-b924-44175936af3a)

