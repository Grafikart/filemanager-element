<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

class FileController extends AbstractController
{
    #[Route('/api/files', name: 'app_get_file', methods: ['GET'])]
    public function index(Request $request): Response
    {
        $folder = $request->query->get('folder');
        $folder = $this->getParameter('kernel.project_dir').'/public/' . $_ENV['FILESYSTEMJS_FOLDER'] . '/' . $folder;
        $finder = new Finder();
        $finder->in($folder)
            ->depth(0)
            ->files();
        $files = iterator_to_array($finder, false);
        $files = array_map(function($d) {
            return $this->toArray($d);
        }, $files);
        return $this->json($files);
    }
    #[Route('/api/files', name: 'app_post_file', methods: ['POST'])]
    public function store(Request $request, SluggerInterface $slugger)
    {
        /** @var UploadedFile $file */
        $file = $request->files->get('file');
        $folder = $request->get('folder');
        $folder = $this->getParameter('kernel.project_dir').'/public/'. $_ENV['FILESYSTEMJS_FOLDER']. '/' . $folder;
        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $slugger->slug($originalFilename);
        $newFilename = $safeFilename.'-'.uniqid().'.'.$file->guessExtension();
        $path = $file->move($folder, $newFilename);
        return $this->json($this->toArray($path));
    }

    #[Route('/api/files/{file}', name: 'app_delete_file', methods: ['DELETE'], requirements: ['file' => '.*'])]
    public function delete(string $file, Filesystem $filesystem)
    {
        $filesystem->remove($file);
        return new Response('', Response::HTTP_NO_CONTENT);
    }

    public function toArray(string $file): array
    {
        $pathinfo = pathinfo($file);
        $filesystem = new Filesystem();
        $rootDirectory = $filesystem->makePathRelative(
            $pathinfo['dirname'],
            $this->getParameter('kernel.project_dir').'/public/'
        );
        return [
            'id' => $file,
            'name' => $pathinfo['basename'],
            'url' => $rootDirectory . $pathinfo['basename'],
            'size' => filesize($file),
            'folder' => $pathinfo['dirname'] === '.' ? null : $pathinfo['dirname'],
            'thumbnail' => $rootDirectory . $pathinfo['basename'],
        ];
    }
}