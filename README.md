# A little love note for Chukki

Open **index.html** in a browser. No installation or server is needed, and the page works offline.

This combines the message-by-message story, stickers, and floating hearts from `love-master` with the interactive proposal and happy ending from `valentine-main`.

The five-part story ends with **“Chukki, would you be mine?”** Saying yes reveals a celebration and a personal love letter. The playful **No** button hops away when hovered over (or tapped on a phone), staying within the visible card and clear of other buttons. There are also back, skip, replay, pause-animation, and a separate “No, thank you” option. Keyboard activation and reduced-motion settings keep the No button usable without chasing it. The layout adapts to phones.

Trying **No** replaces the illustration with the supplied crying Milk and Mocha GIF. This also appears after a keyboard or “No, thank you” decline. Going back, replaying, or saying yes restores the usual artwork. Pausing hearts or enabling reduced motion shows the GIF’s static preview instead.

## Files

- `index.html`: page structure and the final love letter.
- `styles.css`: colors, layout, and animations.
- `script.js`: messages and interactions.
- `assets/`: local illustrations, the heart favicon, and the Milk and Mocha GIF with its static preview.

Reaction source: [Milk and Mocha on Tenor](https://tenor.com/en-GB/view/milk-and-mocha-gif-17237467286723257114). The GIF and its publisher-provided preview are stored locally for offline use.

To edit the messages, change `notes` in `script.js`. The recipient is also mentioned in `index.html` and a few captions/messages in `script.js`; search for `Chukki` to change every mention.

To share the page, send this entire folder or upload its contents to a static website host. Sending only `index.html` will omit the styles, code, and images. Responses are shown only in the recipient’s browser; they are not recorded or sent to you.

The original project folders are retained beside this combined version. `LICENSE` preserves the MIT notice from `valentine-main` (Copyright 2024 Anish); it does not establish a separate license for the supplied illustrations.
