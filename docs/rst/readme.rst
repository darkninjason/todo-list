
Getting Started
-----------------

In order to use *BUILT* you must first ensure your requirejs config is
properly setup. We recommend the following

.. code-block:: js

    require.config({
        baseUrl: <your base url>,

        paths: {
            <any paths you need>
        },

        // Here's where it gets interesting:
        packages:[
            {
                name: 'built'
                location: '<path to your BUILT folder>',
            },
        ],

        <more require configuration>
    });


The important part here is the mapping of the name ``built`` to a location
in the ``packages`` directive. You can probably also use the ``map`` directive
or even ``paths``, but we currently just use ``packages``.



Examples
-----------------

.. toctree::
   :maxdepth: 1

   examples/index
